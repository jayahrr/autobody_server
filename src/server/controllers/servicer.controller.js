const _ = require('lodash')
const { Servicer } = require('./../models/user.model')
const { Request } = require('./../models/request')
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

exports.findByUsername = (req, res) => {
  if (!req.header('x-un')) {
    return res.status(400).send({ message: 'No username found in Request' })
  }
  Servicer.find({ username: req.header('x-un') })
    .then(users => {
      if (!users) {
        return res.send('No user was found with this username.')
      }
      res.json(users[0])
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'user by Email', e)))
}

// GET find a Servicer's Work Requests
exports.findMyWork = async (req, res) => {
  const servicer_id = req.header('x-un')
  const services = await Request.find({ servicer_id }).lean()
  if (!services) {
    throw new Error('Did not find any services for this user')
  }

  // generate requests and request items array
  const requests = services.filter(svc => svc.type === 'request')
  const ritms = services.filter(svc => svc.type === 'item')

  // merge ritms into requests array
  if (requests.length && ritms.length) {
    requests.forEach(request => {
      request.request_items = ritms.filter(
        ritm => ritm.request_id.toString() == request._id.toString()
      )
    })
  }

  return res.json({ requests })
}
