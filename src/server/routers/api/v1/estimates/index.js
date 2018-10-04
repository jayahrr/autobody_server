// call the packages we need
const express = require('express')
const ESTIMATES = require('./../../../../controllers/estimates.controller')
// const { authenticate } = require('./../../../../middleware/authenticate')

// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router() // get an instance of the express Router

// /api/v1/estimates
router
  .route('/')

  .all((req, res, next) => {
    next(new Error('not implemented'))
  })

// /api/v1/estimates/:vin
router
  .route('/:vin')

  .get(ESTIMATES.generateCost)

module.exports = router
