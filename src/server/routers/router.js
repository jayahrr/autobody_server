// call the packages we need
const express      = require('express'),
  CUSTOMERS        = require('./../controllers/user.controller'),
  VEHICLES         = require('./../controllers/vehicle.controller'),
  VEHICLEINSTANCES = require('./../controllers/vehicleInstance.controller')


// ROUTES FOR OUR API
// =============================================================================
const router = express.Router()         // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://:::3000/api)
router.get( '/', function( req, res ) {
  res.json({ message: 'hooray! welcome to our api!' })   
})


// Customers
// ----------------------------------------------------
// on routes that end in /:version/customers
// ----------------------------------------------------
router.route( '/:version/customers' )

  .post( CUSTOMERS.create )
  .get( CUSTOMERS.listAll )
  .delete( CUSTOMERS.deleteAll )
// .put( CUSTOMERS.updateAll )

// ----------------------------------------------------
// on routes that end in /:version/customers/:id
// ----------------------------------------------------
router.route( '/:version/customers/:id' )

  .get( CUSTOMERS.findById )
  .delete( CUSTOMERS.findByIdAndRemove )
// .put(CUSTOMERS.findByIdAndUpdate)


// Vehicles
// ----------------------------------------------------
// on routes that end in /:version/vehicles
// ----------------------------------------------------
router.route( '/:version/vehicles' )

  .post( VEHICLES.create )
  .get( VEHICLES.listAll )
  .delete( VEHICLES.deleteAll )

// ----------------------------------------------------
// on routes that end in /:version/vehicles/:id
// ----------------------------------------------------
router.route( '/:version/vehicles/:id' )

  .get( VEHICLES.findById )
  .delete( VEHICLES.findByIdAndRemove )


// Vehicle Instances
// ----------------------------------------------------
// on routes that end in /:version/vehicleInstances
// ----------------------------------------------------
router.route( '/:version/vehicleInstances' )

  .post( VEHICLEINSTANCES.create )
  .get( VEHICLEINSTANCES.listAll )
  .delete( VEHICLEINSTANCES.deleteAll )

// ----------------------------------------------------
// on routes that end in /:version/vehicleInstances/:id
// ----------------------------------------------------
router.route( '/:version/vehicleInstances/:id' )

  .get( VEHICLEINSTANCES.findById )
  .delete( VEHICLEINSTANCES.findByIdAndRemove )


module.exports = { router }