// call the packages we need
const express = require('express')
const USERS = require('./../../../../controllers/user.controller')
const { authenticate } = require('./../../../../middleware/authenticate')

// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router() // get an instance of the express Router

// /api/v1/users
router
  .route('/')

  .post(USERS.create)
  .get(USERS.list)
  .delete(USERS.deleteAll)

// /api/v1/users/me
router
  .route('/me')

  // .all(authenticate)
  // .get(CUSTOMERS.findMe)
  .get(USERS.findByUsername)

// /api/v1/users/email
router
  .route('/email')

  // .all(authenticate)
  .get(USERS.findByUsername)

// /api/v1/users/myLocation
router
  .route('/myLocation')

  // .all( authenticate )
  .post(USERS.setMyLocation)
  .get(USERS.getMyLocation)

// /api/v1/users/myVehicles
router
  .route('/myVehicles')

  // .all( authenticate )
  .get(USERS.findMyVehicles)

// /api/v1/users/myRequests
router
  .route('/myRequests')

  // .all( authenticate )
  .post(USERS.createMyServiceRequest)
  .get(USERS.findMyRequests)

// /api/v1/users/:id
router
  .route('/:id')

  .get(USERS.findById)
  .delete(USERS.findByIdAndRemove)

module.exports = router
