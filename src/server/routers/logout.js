// call the packages we need
const express       = require('express'),
  LOGOUT            = require('./../controllers/logout.controller'),
  { authenticate }  = require('./../middleware/authenticate')



// ROUTES FOR OUR LOGOUT
// =============================================================================
const logout = express.Router()         // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://:::3000/api)
logout.get( '/', function( req, res ) {
  res.json({ message: 'hooray! welcome to our logout site!' })
})


// ----------------------------------------------------
// on routes that end in /customers
// ----------------------------------------------------
logout.route( '/customers' )

  .delete( authenticate, LOGOUT.customers )
  .get(( req, res ) => { res.send( '<h1>Customer logout page!</h1>' )})


// ----------------------------------------------------
// on routes that end in /service_providers
// ----------------------------------------------------
logout.route( '/service_providers' )

  .delete( LOGOUT.serviceProviders, authenticate )
  .get(( req, res ) => { res.send( '<h1>Service Provider logout page!</h1>' )})

module.exports = { logout }
