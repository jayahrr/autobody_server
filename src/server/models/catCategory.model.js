const { mongoose, extend } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Service Category Schema
const CatalogCategorySchema = BaseSchema.extend({
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: ''
  },
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  description: {
    type: String,
    default: ''
  },
  image: Buffer
}, { collections: 'catalog_category' })

// Create the Service Category Model
const CatalogCategory = mongoose.model( 'catalog_category', CatalogCategorySchema )

module.exports = { CatalogCategory }
