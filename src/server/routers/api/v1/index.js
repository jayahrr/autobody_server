// call the packages we need
const express = require('express')


// ROUTES FOR OUR API
// =============================================================================
const router = express.Router()         // get an instance of the express Router

router.use( '/customers', require('./customers'))
router.use( '/vehicleInstances', require('./vehicleInstances'))

module.exports = router