// call the packages we need
const express = require('express'),
  CUSTOMERS = require('./../../../../controllers/user.controller'),
  { authenticate } = require('./../../../../middleware/authenticate')

// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router() // get an instance of the express Router

// /api/v1/customers
router
  .route('/')

  .post(CUSTOMERS.create)
  .get(CUSTOMERS.list)
  .delete(CUSTOMERS.deleteAll)

// /api/v1/customers/me
router
  .route('/me')

  .all(authenticate)
  .get(CUSTOMERS.findMe)

// /api/v1/customers/myVehicles
router
  .route('/myVehicles')

  // .all( authenticate )
  .get(CUSTOMERS.findMyVehicles)

// /api/v1/customers/:id
router
  .route('/:id')

  .get(CUSTOMERS.findById)
  .delete(CUSTOMERS.findByIdAndRemove)

module.exports = router
