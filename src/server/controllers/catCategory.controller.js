const _ = require('lodash'),
  { CatalogCategory } = require('./../models/catCategory.model'),
  { ObjectID } = require('mongodb'),
  apiErrorMsg = (verb, subject, error) => {
    return { message: `Unable to ${verb} the ${subject}`, error }
  }

// POST   create a category
exports.create = (req, res) => {
  var body = _.pick(req.body, [
    'order',
    'title',
    'description',
    'items',
    'type,',
    'child_categories',
    'parent_categories'
  ])
  if (!body.title) {
    return res.status(400).send('Missing required parameter(s)')
  }

  var newCatCategory = new CatalogCategory(body)
  newCatCategory
    .save()
    .then(doc => {
      res.status(201).json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'category', e)))
}

// GET    list all categories
exports.list = (req, res) => {
  CatalogCategory.find({ type: 'category' })
    .then(docs => {
      res.json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'categories', e)))
}

// DELETE delete all categories
exports.deleteAll = (req, res) => {
  CatalogCategory.remove({ type: 'category' })
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'categories', e)))
}

// GET    return a category by id
exports.findById = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  CatalogCategory.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find Catalog Category by ID')
      }
      res.send(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'category by ID', e)))
}

// DELETE delete a category by id
exports.findByIdAndRemove = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  CatalogCategory.findByIdAndRemove(id)
    .then(doc => {
      res.status(204).send(doc)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('delete', 'category by ID', e))
    )
}
