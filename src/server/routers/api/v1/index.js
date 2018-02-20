// call the packages we need
const express = require('express')


// ROUTES FOR OUR API
// =============================================================================
const router = express.Router()         // get an instance of the express Router

router.use( '/customers', require('./customers'))
router.use( '/vehicles', require('./vehicles'))
router.use( '/vehicleInstances', require('./vehicleInstances'))
router.use( '/catalog_categories', require('./catalog_categories'))
router.use( '/catalog_items', require('./catalog_items'))

module.exports = router