const _ = require('lodash'),
  { Catalog } = require('./../models/catalog.model'),
  { ObjectID } = require('mongodb'),
  apiErrorMsg = (verb, subject, error) => {
    return { message: `Unable to ${verb} the ${subject}`, error }
  }

// POST   create a catalog
exports.create = (req, res) => {
  let body = _.pick(req.body, ['order', 'title', 'description'])
  if (!body.title) {
    return res.status(400).send('Missing required parameter(s)')
  }

  let newCatalog = new Catalog(body)
  newCatalog
    .save()
    .then(doc => {
      res.status(201).json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'catalog', e)))
}

// GET    list all catalogs
exports.list = (req, res) => {
  Catalog.find({ type: 'catalog' })
    .then(docs => {
      res.json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'catalogs', e)))
}

// DELETE delete all catalogs
exports.deleteAll = (req, res) => {
  Catalog.remove({ type: 'catalog' })
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'catalogs', e)))
}

// GET    return a catalog by id
exports.findById = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Catalog.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find Catalog by ID')
      }
      res.json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'catalog by ID', e)))
}

// DELETE delete a catalog by id
exports.findByIdAndRemove = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Catalog.findByIdAndRemove(id)
    .then(doc => {
      res.status(204).json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'catalog by ID', e)))
}

// GET    list the entire catalog, including categories and items
exports.full = (req, res) => {
  // build the full catalog object
  const full_catalog_object = {}
  full_catalog_object.catalog = {}

  Catalog.find({ active: true })
    // return a plain JS Object instead of a Mongoose model object
    .lean()
    .then(docs => {
      let catalog = docs.find(({ type }) => type === 'catalog')

      if (catalog.categories) {
        let categories = []
        catalog.categories.forEach(catId => {
          categories.push(
            docs.find(({ _id }) => _id.toString() === catId.toString())
          )
        })
        if (categories.length) {
          categories.forEach(category => {
            let catItems = []
            category.cat_items.forEach(itemId => {
              catItems.push(
                docs.find(({ _id }) => _id.toString() === itemId.toString())
              )
            })
            category.cat_items = catItems
          })
        }
        catalog.categories = categories
      }

      // console.log(full_catalog_object.catalog)
      return (full_catalog_object.catalog = catalog)
    })
    .then(() => res.json(full_catalog_object))
    .catch(e => res.status(400).send(apiErrorMsg('get', 'full catalog', e)))
}
