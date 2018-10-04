const _ = require('lodash')
const { Servicer, Customer } = require('./../models/user.model')
const { Request } = require('./../models/request')
const { RequestItem } = require('./../models/requestItem')
const { CatalogItem } = require('./../models/catItem.model')
const { ObjectID } = require('mongodb')

const apiErrorMsg = (verb, subject, error) => {
  return { message: `Unable to ${verb} the ${subject}`, error }
}

// POST   create a servicer
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

  var newServicer = new Servicer(body)
  newServicer
    .save()
    .then(() => {
      return newServicer.generateAuthToken()
    })
    .then(token => {
      res
        .status(201)
        .header('x-auth', token)
        .json(newServicer)
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'servicer', e)))
}

// GET    list all servicers
exports.list = (req, res) => {
  Servicer.find({ type: 'Servicer' })
    .then(docs => {
      res.json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'servicers', e)))
}

// DELETE delete all servicers
exports.deleteAll = (req, res) => {
  Servicer.remove()
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'servicers', e)))
}

// GET find a servicer by an ID
exports.findById = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Servicer.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find any Servicer with this ID')
      }
      res.json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'servicer by ID', e)))
}

// DELETE find a servicer by an ID and delete
exports.findByIdAndRemove = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Servicer.findByIdAndRemove(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find any Servicer with this ID')
      }
      res.status(204).json(doc)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('delete', 'servicer by ID', e))
    )
}

exports.findMe = (req, res) => {
  if (!req.token) {
    return res.status(400).send({ message: 'No token found in Request' })
  }

  Servicer.findByToken(req.token)
    .then(me => {
      if (!me) {
        return res
          .status(400)
          .send({ message: 'No user found by token provided' })
      }

      return res.json(me)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'servicer', e)))
}

exports.updateMe = async (req, res) => {
  const userID = req.header('x-un')
  if (!userID) {
    return res.status(400).send({ message: 'No username found in Request' })
  }

  let user
  console.log('req.body: ', req.body)
  try {
    user = await Servicer.findByIdAndUpdate(userID, req.body.update, {
      new: true
    }).lean()
  } catch (error) {
    res.json({ error })
    throw new Error(error)
  }

  return res.json(user)
}

exports.findByUsername = async (req, res) => {
  if (!req.header('x-un')) {
    return res.status(400).send({ message: 'No username found in Request' })
  }

  let user
  let catItems = []
  let serviceLines = []

  try {
    user = await Servicer.find({ username: req.header('x-un') }).lean()
    user = user[0]
    catItems = await CatalogItem.find({ type: 'cat_item' }).lean()
    serviceLines = []
  } catch (error) {
    res.json({ error })
    throw new Error(error)
  }

  if (user.service_lines && user.service_lines.length !== 0) {
    user.service_lines.forEach(lineID => {
      const catItem = catItems.find(
        item => item._id.toString() === lineID.toString()
      )
      if (catItem) {
        serviceLines.push(catItem)
      }
    })
  }

  user.service_lines = serviceLines

  return res.json(user)
}

// GET find a Servicer's Work Requests
exports.findMyWork = async (req, res) => {
  const servicer_id = req.header('x-un')
  console.log('servicer_id: ', servicer_id)
  let requests = []

  if (!servicer_id) {
    return res.status(400).send('No Servicer ID specified')
  }

  if (!ObjectID.isValid(servicer_id)) {
    return res.status(400).send('Invalid Servicer ID')
  }

  try {
    // generate requests
    requests = await Request.find({ servicer_id, active: true }).lean()

    // merge ritms into requests array
    if (requests.length) {
      for (let index = 0; index < requests.length; index++) {
        const request = requests[index]
        if (request.reqItemIds.length !== 0) {
          request.request_items = await RequestItem.find({
            request_id: request._id,
            active: true
          })
        }
        if (request.requester_id) {
          request.requester = await Customer.findById(request.requester_id)
        }
      }
    }
  } catch (error) {
    throw new Error('Did not find any services for this user', error)
  }

  return res.json(requests)
}

exports.getMyLocation = async (req, res) => {
  const servicer_id = req.header('x-un')
  let location = null

  if (!servicer_id) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(servicer_id)) {
    return res.status(400).send('Invalid ID')
  }

  try {
    location = await Servicer.findById(servicer_id)
  } catch (error) {
    throw new Error('Error setting location of user.', error)
  }

  return res.json({ location })
}

exports.setMyLocation = async (req, res) => {
  const servicer_id = req.header('x-un')
  console.log('servicer_id: ', servicer_id)
  let location = null
  let body = _.pick(req.body, ['current_location', 'current_address'])

  if (!servicer_id) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(servicer_id)) {
    return res.status(400).send('Invalid ID')
  }

  try {
    location = await Servicer.findByIdAndUpdate(
      servicer_id,
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
