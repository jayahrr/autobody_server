// BASE SETUP
// =============================================================================

// call the packages we need
const express     = require('express'),
  path            = require('path'),
  bodyParser      = require('body-parser'),
  morgan          = require('morgan'),
  // call the Router object
  { router }      = require('./routers/router'),
  { login }       = require('./routers/login'),
  { authenticate }= require('./middleware/authenticate'),

  app = express()

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use( bodyParser.urlencoded({ extended: true }))
app.use( bodyParser.json() )
// configure app to use mogran
// this logger will output all requests into the console
app.use(morgan( 'combined' ))



// REGISTER OUR ROUTES -------------------------------

// all of our routes will be prefixed with /api
app.use( '/api', router )
app.use( '/login', login )

// Homepage
app.get( '/', (req, res) => { res.send( '<h1>Hello Express!</h1>' )})

// Bad Request page
app.get( '/bad', (req, res) => { res.send( '<h1>Bad Request!</h1>' )})


app.get( '/customers/me', authenticate, ( req, res ) => {
  res.send( req.person )
})



// START WEB APP -------------------------------------
const server = app.listen( 3000, () => {
  const { address, port } = server.address()  
  console.log( `Server is up at http://${ address }:${ port }` )
})
