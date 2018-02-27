const _ = require('lodash'),
  { RequestItem } = require('./../models/requestItem'),
  { ObjectID } = require('mongodb'),
  apiErrorMsg = (verb, subject, error) => {
    return { message: `Unable to ${verb} the ${subject}`, error }
  }

// POST   create a request item
exports.create = (req, res) => {
  let body = _.pick(req.body, [
    'number',
    'state',
    'short_description',
    'description',
    'priority',
    'request_id',
    'requester_vehicle_id',
    'servicer_id',
    'catalog_item_id'
  ])
  if (!body.number) {
    return res.status(400).send('Missing required parameter(s)')
  }

  let newRequestItem = new RequestItem(body)
  newRequestItem
    .save()
    .then(doc => {
      res.status(201).json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'request item', e)))
}

// GET    list all request items
exports.list = (req, res) => {
  RequestItem.find({ type: 'item' })
    .then(docs => {
      res.json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'request items', e)))
}

// DELETE delete all request items
exports.deleteAll = (req, res) => {
  RequestItem.remove({ type: 'item' })
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'request items', e)))
}

// GET    return a request item by id
exports.findById = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  RequestItem.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find request item by ID')
      }
      res.json(doc)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('get', 'request item by ID', e))
    )
}

// DELETE delete a request item by id
exports.findByIdAndRemove = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  RequestItem.findByIdAndRemove(id)
    .then(doc => {
      res.status(204).json(doc)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('delete', 'request item by ID', e))
    )
}
