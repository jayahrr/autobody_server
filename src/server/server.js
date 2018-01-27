require('./config/config')

// call the packages we need
const express     = require('express'),
  bodyParser      = require('body-parser'),
  morgan          = require('morgan'),
  path            = require('path'),
  publicPath      = path.join(__dirname, '../client'),
  { authenticate }= require('./middleware/authenticate'),
  port = process.env.PORT,

  app = express()

// serve up the public files
app.use( express.static( publicPath ))
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use( bodyParser.urlencoded({ extended: true }))
app.use( bodyParser.json() )
// configure app to use mogran
// this logger will output all requests into the console
app.use( morgan( 'combined' ))



// REGISTER OUR ROUTES -------------------------------

app.use( '/api', require('./routers/api') )
app.use( '/login', require('./routers/login') )
app.use( '/logout', require('./routers/logout') )

// Bad Request page
app.get( '/bad', (req, res) => { 
  res.send( '<h1>Bad Request!</h1>' )
})
// Profile page
app.get( '/customers/me', authenticate, ( req, res ) => {
  res.send( req.person )
})



// START WEB APP -------------------------------------
const server = app.listen( port, () => {
  const { address, port } = server.address()  
  console.log( `Server is up at http://${ address }:${ port }` )
})