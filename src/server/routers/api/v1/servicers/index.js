// call the packages we need
const express = require('express')
const Servicer = require('./../../../../controllers/servicer.controller')
const { authenticate } = require('./../../../../middleware/authenticate')

// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router() // get an instance of the express Router

// /api/v1/servicers
router
  .route('/')

  .post(Servicer.create)
  .get(Servicer.list)
  .delete(Servicer.deleteAll)

// /api/v1/servicers/me
router
  .route('/me')

  .all(authenticate)
  .get(Servicer.findMe)

// /api/v1/servicers/me
router
  .route('/me/location')

  // .all(authenticate)
  .get(Servicer.getMyLocation)
  .post(Servicer.setMyLocation)

// /api/v1/servicers/email
router
  .route('/email')

  // .all(authenticate)
  .get(Servicer.findByUsername)

// /api/v1/servicers/work
router
  .route('/work')

  .get(Servicer.findMyWork)

// /api/v1/servicers/:id
router
  .route('/:id')

  .get(Servicer.findById)
  .delete(Servicer.findByIdAndRemove)

module.exports = router
