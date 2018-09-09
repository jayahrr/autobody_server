require('./config/config')

// call the packages we need
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const publicPath = path.join(__dirname, '../client')
// const { authenticate } = require('./middleware/authenticate')
const port = process.env.PORT
const app = express()

// set some Access Controls
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-un'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

// serve up the public files
app.use(express.static(publicPath))
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// configure app to use mogran
// this logger will output all requests into the console
app.use(morgan('combined'))

// REGISTER OUR ROUTES -------------------------------

app.use('/api', require('./routers/api'))
app.use('/login', require('./routers/login'))
app.use('/logout', require('./routers/logout'))

// Bad Request page
app.get('/bad', (req, res) => {
  res.send('<h1>Bad Request!</h1>')
})

// START WEB APP -------------------------------------
const server = app.listen(port, () => {
  const { address, port } = server.address()
  console.log(`Server is up at http://${address}:${port}`)
})

module.exports.app = server
