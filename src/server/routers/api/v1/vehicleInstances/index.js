// call the packages we need
const express = require('express'),
  VEHICLEINSTANCES = require('./../../../../controllers/vehicleInstance.controller')

// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router() // get an instance of the express Router

// /api/v1/vehicleInstances
router
  .route('/')

  .post(VEHICLEINSTANCES.create)
  .get(VEHICLEINSTANCES.list)
  .delete(VEHICLEINSTANCES.deleteAll)

// /api/v1/vehicleInstances/:id
router
  .route('/:id')

  .get(VEHICLEINSTANCES.findById)
  .delete(VEHICLEINSTANCES.findByIdAndRemove)
  .put(VEHICLEINSTANCES.findByIdAndUpdate)

module.exports = router
