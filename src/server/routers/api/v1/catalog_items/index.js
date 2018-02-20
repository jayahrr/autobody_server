// call the packages we need
const express = require('express'),
  CAT_ITEMS   = require('./../../../../controllers/catItem.controller')


// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router()         // get an instance of the express Router


// /api/v1/catalog_items
router.route( '/' )

  .post( CAT_ITEMS.create )
  .get( CAT_ITEMS.list )
  .delete( CAT_ITEMS.deleteAll )


// /api/v1/catalog_items/:id
router.route( '/:id' )

  .get( CAT_ITEMS.findById )
  .delete( CAT_ITEMS.findByIdAndRemove )


module.exports = router