// call the packages we need
const express = require('express'),
  LOGIN       = require('./../controllers/login.controller')


// ROUTES FOR OUR LOGIN
// =============================================================================
const login = express.Router()         // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://:::3000/api)
login.get( '/', function( req, res ) {
  res.json({ message: 'hooray! welcome to our login site!' })   
})


// Customers
// ----------------------------------------------------
// on routes that end in /customers
// ----------------------------------------------------
login.route( '/customers' )

  .post( LOGIN.customers )
  .get((req, res) => { res.send( '<h1>Customer login page!</h1>' )})


// ----------------------------------------------------
// on routes that end in /service_providers
// ----------------------------------------------------
login.route( '/service_providers' )

  .post( LOGIN.serviceProviders )
  .get((req, res) => { res.send( '<h1>Service Provider login page!</h1>' )})

module.exports = { login }
