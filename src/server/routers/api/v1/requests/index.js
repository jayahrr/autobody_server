// call the packages we need
const express = require('express'),
  REQUEST = require('./../../../../controllers/request')

// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router() // get an instance of the express Router

// /api/v1/requests
router
  .route('/')

  .post(REQUEST.create)
  .get(REQUEST.list)
  .delete(REQUEST.deleteAll)

// /api/v1/requests/nearby/:lat/:lon/:rad
router
  .route('/nearby/:lat/:lon/:rad')

  .get(REQUEST.findNearbyRequestsByLocation)

// /api/v1/requests/:id
router
  .route('/:id')

  .get(REQUEST.findById)
  .delete(REQUEST.findByIdAndRemove)

module.exports = router
