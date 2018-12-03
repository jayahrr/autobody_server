const _ = require('lodash')
const { Servicer, Customer, User } = require('./../models/user.model')
const { VehicleInstance } = require('../models/vehicleInstance.model')
const { Request } = require('../models/request')
const { RequestItem } = require('../models/requestItem')
const { ObjectID } = require('mongodb')
const { pusher } = require('../config/config')

const apiErrorMsg = (verb, subject, error) => {
  return { message: `Unable to ${verb} the ${subject}`, error }
}

// POST   create a user
exports.create = (req, res) => {
  var body = _.pick(req.body, [
    'name',
    'first_name',
    'last_name',
    'email',
    'phone',
    'username',
    'password',
    'type'
  ])

  if (!body.first_name || !body.last_name || !body.email || !body.password) {
    return res.status(400).send('Missing required parameter(s)')
  }

  var type = body.type.toString()
  if (!type || (type !== 'Customer' && type !== 'Servicer')) {
    return res.status(400).send('User type not accepted')
  }

  var newUser = type === 'Customer' ? new Customer(body) : new Servicer(body)
  newUser
    .save()
    .then(() => {
      return newUser.generateAuthToken()
    })
    .then(token => {
      res
        .status(201)
        .header('x-auth', token)
        .json(newUser)
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'customer', e)))
}

// GET    list all users or user types
exports.list = (req, res) => {
  var type = req.header('x-type')
  var qry = type ? { type } : {}
  User.find(qry)
    .then(docs => {
      res.json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'customers', e)))
}

// DELETE delete all users or user types
exports.deleteAll = (req, res) => {
  var type = req.header('x-type')
  var qry = type ? { type } : {}
  User.remove(qry)
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'customers', e)))
}

// GET find a user by an ID
exports.findById = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Customer.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find any Customer with this ID')
      }
      res.json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'customer by ID', e)))
}

// DELETE find a user by an ID and delete
exports.findByIdAndRemove = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Customer.findByIdAndRemove(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find any Customer with this ID')
      }
      res.status(204).json(doc)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('delete', 'customer by ID', e))
    )
}

exports.findMe = (req, res) => {
  if (!req.token) {
    return res.status(400).send({ message: 'No token found in Request' })
  }
  Customer.findByToken(req.token)
    .then(me => {
      if (!me) {
        return res
          .status(400)
          .send({ message: 'No user found by token provided' })
      }

      return res.json(me)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'customer', e)))
}

// exports.findByUsername = (req, res) => {
//   if (!req.header('x-un')) {
//     return res.status(400).send({ message: 'No username found in Request' })
//   }
//   Customer.find({ username: req.header('x-un') })
//     .then(users => {
//       if (!users) {
//         return res.send('No user was found with this username.')
//       }
//       res.json(users[0])
//     })
//     .catch(e => res.status(400).send(apiErrorMsg('get', 'user by Email', e)))
// }

exports.findByUsername = async (req, res) => {
  if (!req.header('x-un')) {
    return res
      .status(400)
      .send({ message: 'No username found in Request', error: true })
  }

  let user = {}

  try {
    user = await User.find({ username: req.header('x-un') }).lean()
    user = user[0]
    if (user) {
      user.vehicle_instances = await VehicleInstance.find({
        owner: user._id
      }).lean()
    } else {
      return res
        .status(400)
        .send({ message: 'No user found with that username', error: true })
    }
  } catch (error) {
    console.log('error: ', error)
    res.status(400).send({ error })
  }

  return res.json(user)
}

// GET find a Customer's Vehicle Instances
exports.findMyVehicles = async (req, res) => {
  const owner = req.header('x-un')
  const vehicles = await VehicleInstance.find({ owner }).lean()
  if (!vehicles.length) {
    return res.json(vehicles)
  }
  const reqs = await Request.find({ requester_id: owner, active: true }).lean()
  const reqitems = await RequestItem.find({
    requester_id: owner,
    active: true
  }).lean()

  // for each vehicle
  vehicles.forEach(vehicle => {
    // generate the requests array
    const requests = reqs.filter(doc => {
      if (doc.requester_vehicle_id !== undefined)
        return doc.requester_vehicle_id.toString() === vehicle._id.toString()
      return false
    })

    // if requests array is not empty
    if (!_.isEmpty(requests)) {
      // for each request
      requests.forEach(request => {
        // generate a ritms array
        const ritms = reqitems.filter(doc => {
          if (doc.request_id !== undefined)
            return doc.request_id.toString() === request._id.toString()
          return false
        })
        if (!_.isEmpty(ritms)) request.request_items = ritms
      })
      // set  vehicle's services
      vehicle.services = requests
    }
  })
  return res.json(vehicles)
}

// GET find a Customer's Requests
exports.findMyRequests = async (req, res) => {
  const requester_id = req.header('x-un')
  const requests = await Request.find({ requester_id, active: true }).lean()
  const requestItems = await RequestItem.find({
    requester_id,
    active: true
  }).lean()

  // merge ritms into requests
  if (requests.length && requestItems.length) {
    requests.forEach(req => {
      req.request_items = requestItems.filter(
        ritm => ritm.request_id.toString() == req._id.toString()
      )
    })
  }

  return res.json({ requests, requestItems })
}

// POST create a Customer's Requests
exports.createMyServiceRequest = async (req, res) => {
  let body = _.pick(req.body, [
    'service_date',
    'service_location',
    'service_location_address',
    'description',
    'short_description',
    'requester_vehicle_id',
    'requester_id',
    'cartItems',
    'cost_estimate'
  ])

  body.cost_estimate = Number(body.cost_estimate)
  body.number = `REQ100${Math.floor(Math.random() * 10 + 1)}`
  body.sys_created_by = body.sys_updated_by = body.requester_id

  try {
    const newRequest = new Request(body)
    let doc = await newRequest.save()
    doc = await doc.toObject()

    const requestItems = await RequestItem.find({
      request_id: doc._id
    })
    doc.request_items = requestItems ? requestItems : []
    doc.requester = await Customer.findById(doc.requester_id)
    doc.requester_vehicle = await VehicleInstance.findById(
      doc.requester_vehicle_id
    )
    res.status(201).json(doc)
    pusher.trigger('Requests', 'inserted', { request: doc })
  } catch (error) {
    res.status(400).send(apiErrorMsg('create', 'request', error))
  }
}

exports.updateMyRequest = async (req, res) => {
  let updatedReq
  const userID = req.header('x-un')
  const reqID = req.body.id || req.body._id
  const reqState = req.body.state

  if (!reqID) {
    return res.status(400).send('No reqID provided.')
  }

  if (!ObjectID.isValid(reqID)) {
    return res.status(400).send('Invalid reqID')
  }

  if (!userID) {
    return res.status(400).send('No userID validated')
  }

  if (!ObjectID.isValid(userID)) {
    return res.status(400).send('Invalid userID')
  }

  if (reqState) {
    if (reqState === 'Closed Complete') {
      req.body.closed = new Date()
      req.body.closed_by = userID
      req.body.active = false
    }
  }

  try {
    updatedReq = await Request.findByIdAndUpdate(reqID, req.body, {
      new: true
    }).lean()
    const reqitems = await RequestItem.find({
      request_id: updatedReq._id,
      active: true
    }).lean()
    if (!_.isEmpty(reqitems)) {
      updatedReq.request_items = reqitems
    }
  } catch (error) {
    return res.status(400).send(apiErrorMsg('update', 'request by ID', e))
  }

  pusher.trigger('REQ_' + reqID, 'updated', updatedReq)
  return res.json(updatedReq)
}

exports.getMyLocation = async (req, res) => {
  const userID = req.header('x-un')
  let location = null

  if (!userID) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(userID)) {
    return res.status(400).send('Invalid ID')
  }

  try {
    location = await Servicer.findById(userID)
  } catch (error) {
    throw new Error('Error setting location of user.', error)
  }

  return res.json({ location })
}

exports.setMyLocation = async (req, res) => {
  const userID = req.header('x-un')
  let location = null
  let body = _.pick(req.body, ['current_location', 'current_address'])

  if (!userID) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(userID)) {
    return res.status(400).send('Invalid ID')
  }

  try {
    location = await Servicer.findByIdAndUpdate(
      userID,
      {
        current_location: body.current_location,
        current_address: body.current_address
      },
      { new: true, select: 'current_location current_address' }
    ).lean()
  } catch (error) {
    throw new Error('Error setting location of user.', error)
  }

  return res.json({ location })
}
