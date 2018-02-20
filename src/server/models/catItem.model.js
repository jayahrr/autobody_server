const { mongoose, extend, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Service Schema
const CatalogItemSchema = BaseSchema.extend({
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
  category: [{
    type: Schema.ObjectId,
    ref: 'catalog_category'
  }],
  price: {
    type: Number,
    default: ''
  },
  estimated_duration: {
    type: Number,
    default: ''
  },
  image: Buffer
}, { collections: 'catalog_item' })

// Create the Service Model
const CatalogItem = mongoose.model( 'catalog_item', CatalogItemSchema )

module.exports = { CatalogItem }
