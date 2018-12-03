// call the packages we need
const express = require('express')

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router() // get an instance of the express Router

router.use('/users', require('./users'))
router.use('/customers', require('./customers'))
router.use('/servicers', require('./servicers'))
router.use('/vehicles', require('./vehicles'))
router.use('/vehicleInstances', require('./vehicleInstances'))
router.use('/catalog_categories', require('./catalog_categories'))
router.use('/catalog_items', require('./catalog_items'))
router.use('/catalog', require('./catalog'))
router.use('/requests', require('./requests'))
router.use('/requestItems', require('./requestItems'))
router.use('/estimates', require('./estimates'))

module.exports = router
