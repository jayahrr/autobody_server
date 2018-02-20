// call the packages we need
const express = require('express'),
  VEHICLES   = require('./../../../../controllers/vehicle.controller')


// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router()         // get an instance of the express Router


// /api/v1/vehicles
router.route( '/' )

  .post( VEHICLES.create )
  .get( VEHICLES.list )
  .delete( VEHICLES.deleteAll )


// /api/v1/vehicles/:id
router.route( '/:id' )

  .get( VEHICLES.findById )
  .delete( VEHICLES.findByIdAndRemove )


module.exports = router