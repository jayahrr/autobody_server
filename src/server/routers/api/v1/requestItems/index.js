// call the packages we need
const express = require('express'),
  REQUESTITEMS = require('./../../../../controllers/requestItem')

// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router() // get an instance of the express Router

// /api/v1/requestItems
router
  .route('/')

  .post(REQUESTITEMS.create)
  .get(REQUESTITEMS.list)
  .delete(REQUESTITEMS.deleteAll)

// /api/v1/requestItems/:id
router
  .route('/:id')

  .get(REQUESTITEMS.findById)
  .delete(REQUESTITEMS.findByIdAndRemove)

module.exports = router
