// call the packages we need
const express       = require('express'),
  LOGOUT            = require('./../../controllers/logout.controller'),
  { authenticate }  = require('./../../middleware/authenticate')


// ROUTES FOR OUR LOGOUT
// =============================================================================
const router = express.Router()         // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://:::3000/api)
router.get( '/', function( req, res ) {
  res.send({ message: 'hooray! welcome to our logout site!' })
})


// on routes that end in /customers
// ----------------------------------------------------
router.route( '/customers' )

  .all( authenticate )
  .delete( LOGOUT.customers )
  .get(( req, res ) => {
    res.send( '<h1>Customer logout page! Use DELETE method to logout.</h1>' )
  })


// on routes that end in /service_providers
// ----------------------------------------------------
router.route( '/service_providers' )

  .all( authenticate )
  .delete( LOGOUT.serviceProviders)
  .get(( req, res ) => {
    res.send( '<h1>Service Provider logout page! Use DELETE method to logout.</h1>' )
  })

module.exports = router
