// call the packages we need
const express = require('express')
// VEHICLES         = require('./../controllers/vehicle.controller')
// VEHICLEINSTANCES = require('./../controllers/vehicleInstance.controller'),
// { authenticate }  = require('./../middleware/authenticate')

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router() // get an instance of the express Router

router.use('/v1', require('./v1'))

// MAY JUST DELETE THE CONTENT BELOW. NOT SURE YET. 01252018

// ----------------------------------------------------
// on routes that end in /:version/customers/vehicleInstances
// ----------------------------------------------------
// router.route( '/:version/customers/vehicleInstances' )

//   .get( authenticate, CUSTOMERS.findMyVehicles )

// // Vehicles
// // ----------------------------------------------------
// // on routes that end in /:version/vehicles
// // ----------------------------------------------------
// router.route( '/:version/vehicles' )

//   .post( VEHICLES.create )
//   .get( VEHICLES.listAll )
//   .delete( VEHICLES.deleteAll )

// // ----------------------------------------------------
// // on routes that end in /:version/vehicles/:id
// // ----------------------------------------------------
// router.route( '/:version/vehicles/:id' )

//   .get( VEHICLES.findById )
//   .delete( VEHICLES.findByIdAndRemove )

// // Vehicle Instances
// // ----------------------------------------------------
// // on routes that end in /:version/vehicleInstances
// // ----------------------------------------------------
// router.route( '/:version/vehicleInstances' )

//   .post( VEHICLEINSTANCES.create )
//   .get( VEHICLEINSTANCES.listAll )
//   .delete( VEHICLEINSTANCES.deleteAll )

// // ----------------------------------------------------
// // on routes that end in /:version/vehicleInstances/:id
// // ----------------------------------------------------
// router.route( '/:version/vehicleInstances/:id' )

//   .get( VEHICLEINSTANCES.findById )
//   .delete( VEHICLEINSTANCES.findByIdAndRemove )

module.exports = router
