// call the packages we need
const express = require('express'),
  CATALOG = require('./../../../../controllers/catalog.controller')

// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router() // get an instance of the express Router

// /api/v1/catalog
router
  .route('/')

  .post(CATALOG.create)
  .get(CATALOG.list)
  .delete(CATALOG.deleteAll)

// /api/v1/catalog/full
router
  .route('/full')

  .get(CATALOG.full)

// /api/v1/catalog/:id
router
  .route('/:id')

  .get(CATALOG.findById)
  .delete(CATALOG.findByIdAndRemove)

module.exports = router
