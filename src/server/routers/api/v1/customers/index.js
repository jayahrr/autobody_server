// call the packages we need
const express = require('express')
const CUSTOMERS = require('./../../../../controllers/user.controller')
const { authenticate } = require('./../../../../middleware/authenticate')

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

  // .all(authenticate)
  // .get(CUSTOMERS.findMe)
  .get(CUSTOMERS.findByUsername)

// /api/v1/customers/email
router
  .route('/email')

  // .all(authenticate)
  .get(CUSTOMERS.findByUsername)

// /api/v1/customers/myVehicles
router
  .route('/myVehicles')

  // .all( authenticate )
  .get(CUSTOMERS.findMyVehicles)

// /api/v1/customers/myRequests
router
  .route('/myRequests')

  // .all( authenticate )
  .post(CUSTOMERS.createMyServiceRequest)
  .get(CUSTOMERS.findMyRequests)
  .put(CUSTOMERS.updateMyRequest)

// /api/v1/customers/:id
router
  .route('/:id')

  .get(CUSTOMERS.findById)
  .delete(CUSTOMERS.findByIdAndRemove)

module.exports = router
