// call the packages we need
const express = require('express'),
  CAT_CATEGORIES = require('./../../../../controllers/catCategory.controller')

// ROUTES FOR OUR API
// ----------------------------------------------------
const router = express.Router() // get an instance of the express Router

// /api/v1/catalog_categories
router
  .route('/')

  .post(CAT_CATEGORIES.create)
  .get(CAT_CATEGORIES.list)
  .delete(CAT_CATEGORIES.deleteAll)

// /api/v1/catalog_categories/items
// router.route( '/items' )

//   .all( authenticate )
//   .get( CAT_CATEGORIES.findCatItems )

// /api/v1/catalog_categories/:id
router
  .route('/:id')

  .get(CAT_CATEGORIES.findById)
  .delete(CAT_CATEGORIES.findByIdAndRemove)

module.exports = router
