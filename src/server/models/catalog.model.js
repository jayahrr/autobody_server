const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Service Catalog Schema
const CatalogSchema = BaseSchema.extend(
  {
    active: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      required: true,
      minlength: 1
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'catalog'
    },
    thumbnail: Buffer,
    categories: [{ ref: 'Catalog', type: Schema.ObjectId }]
  },
  { collection: 'Catalog' }
)

// Create the Service Category Model
const Catalog = mongoose.model('Catalog', CatalogSchema)

module.exports = { Catalog }
