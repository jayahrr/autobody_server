// call the packages we need
const express = require('express')

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router() // get an instance of the express Router

router.use('/v1', require('./v1'))

module.exports = router
