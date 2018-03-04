const _ = require('lodash'),
  { CatalogItem } = require('./../models/catItem.model'),
  { ObjectID } = require('mongodb'),
  apiErrorMsg = (verb, subject, error) => {
    return { message: `Unable to ${verb} the ${subject}`, error }
  }

// POST   create a catalog item
exports.create = (req, res) => {
  let body = _.pick(req.body, [
    'order',
    'title',
    'description',
    'categories',
    'attrs'
  ])
  if (!body.title) {
    return res.status(400).send('Missing required parameter(s)')
  }

  let newCatItem = new CatalogItem(body)
  newCatItem
    .save()
    .then(doc => {
      res.status(201).json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'catalog item', e)))
}

// GET    list all catalog items
exports.list = (req, res) => {
  CatalogItem.find({ type: 'cat_item' })
    .then(docs => {
      res.json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'catalog items', e)))
}

// DELETE delete all catalog items
exports.deleteAll = (req, res) => {
  CatalogItem.remove({ type: 'cat_item' })
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'catalog items', e)))
}

// GET    return a catalog item by id
exports.findById = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  CatalogItem.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find Catalog Item by ID')
      }
      res.json(doc)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('get', 'catalog item by ID', e))
    )
}

// DELETE delete a catalog item by id
exports.findByIdAndRemove = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  CatalogItem.findByIdAndRemove(id)
    .then(doc => {
      res.status(204).json(doc)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('delete', 'catalog item by ID', e))
    )
}
