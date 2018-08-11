const _ = require('lodash'),
  { Customer } = require('./../models/user.model'),
  { VehicleInstance } = require('./../models/vehicleInstance.model'),
  { Request } = require('./../models/request'),
  { ObjectID } = require('mongodb')

const apiErrorMsg = (verb, subject, error) => {
  return { message: `Unable to ${verb} the ${subject}`, error }
}

// POST   create a customer
exports.create = (req, res) => {
  var body = _.pick(req.body, [
    'first_name',
    'last_name',
    'email',
    'phone',
    'username',
    'password'
  ])
  if (!body.first_name || !body.last_name || !body.email || !body.password) {
    return res.status(400).send('Missing required parameter(s)')
  }

  var newCustomer = new Customer(body)
  newCustomer
    .save()
    .then(() => {
      return newCustomer.generateAuthToken()
    })
    .then(token => {
      res
        .status(201)
        .header('x-auth', token)
        .json(newCustomer)
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'customer', e)))
}

// GET    list all customers
exports.list = (req, res) => {
  Customer.find({ type: 'Customer' })
    .then(docs => {
      res.json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'customers', e)))
}

// DELETE delete all customers
exports.deleteAll = (req, res) => {
  Customer.remove()
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'customers', e)))
}

// GET find a customer by an ID
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

// DELETE find a customer by an ID and delete
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

exports.findByUsername = (req, res) => {
  if (!req.header('x-un')) {
    return res.status(400).send({ message: 'No username found in Request' })
  }
  Customer.find({ username: req.header('x-un') })
    .then(users => {
      if (!users) {
        return res.send('No user was found with this username.')
      }
      res.json(users[0])
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'user by Email', e)))
}

// GET find a Customer's Vehicle Instances
exports.findMyVehicles = async (req, res) => {
  const owner = req.header('x-un')
  const vehicles = await VehicleInstance.find({ owner }).lean()
  const docs = await Request.find({ requester_id: owner }).lean()
  if (!vehicles.length) {
    return res.send('You have no vehicles')
  }

  // for each vehicle
  vehicles.forEach(vehicle => {
    // generate the requests array
    const requests = docs.filter(doc => {
      if (doc.requester_vehicle_id !== undefined)
        return doc.requester_vehicle_id.toString() === vehicle._id.toString()
      return false
    })

    if (!_.isEmpty(requests)) {
      // for each request
      requests.forEach(request => {
        // generate a ritms array
        const ritms = docs.filter(doc => {
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
exports.findMyServices = async (req, res) => {
  const requester_id = req.header('x-un')
  const services = await Request.find({ requester_id }).lean()
  if (!services) {
    throw new Error('Did not find any services for this user')
  }

  // generate requests and request items array
  const requests = services.filter(svc => svc.type === 'request')
  const ritms = services.filter(svc => svc.type === 'item')

  // merge ritms into requests
  if (requests.length && ritms.length) {
    requests.forEach(request => {
      request.request_items = ritms.filter(
        ritm => ritm.request_id.toString() == request._id.toString()
      )
    })
  }

  return res.json({ requests })
}

// POST find a Customer's Requests
exports.createMyServiceRequest = (req, res) => {
  let body = _.pick(req.body, [
    'service_date',
    'service_location',
    'description',
    'short_description',
    'requester_vehicle_id',
    'requester_id',
    'cartItemIds'
  ])
  body.number = `REQ100${Math.floor(Math.random() * 10 + 1)}`
  let newRequest = new Request(body)
  newRequest
    .save()
    .then(doc => {
      res.status(201).json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'request', e)))
}
