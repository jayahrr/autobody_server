const _ = require('lodash'),
  { Request } = require('./../models/request'),
  { ObjectID } = require('mongodb'),
  apiErrorMsg = (verb, subject, error) => {
    return { message: `Unable to ${verb} the ${subject}`, error }
  }

// POST   create a request
exports.create = (req, res) => {
  let body = _.pick(req.body, ['number', 'state', 'requester_id'])
  if (!body.number) {
    return res.status(400).send('Missing required parameter(s)')
  }

  let newRequest = new Request(body)
  newRequest
    .save()
    .then(doc => {
      res.status(201).json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'request', e)))
}

// GET    list all requests
exports.list = (req, res) => {
  Request.find({ type: 'request' })
    .then(docs => {
      res.json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'requests', e)))
}

// DELETE delete all requests
exports.deleteAll = (req, res) => {
  Request.remove({ type: 'request' })
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'requests', e)))
}

// GET    return a request by id
exports.findById = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Request.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find Request by ID')
      }
      res.json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'request by ID', e)))
}

// DELETE delete a request by id
exports.findByIdAndRemove = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Request.findByIdAndRemove(id)
    .then(doc => {
      res.status(204).json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'request by ID', e)))
}
