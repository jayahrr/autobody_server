const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Service Category Schema
const CatalogItemSchema = BaseSchema.extend(
  {
    active: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: ''
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
    thumbnail: Buffer,
    type: {
      type: String,
      default: 'cat_item'
    },
    categories: [
      {
        category_id: { ref: 'Catalog', type: Schema.ObjectId }
      }
    ],
    attrs: [
      {
        name: String,
        type: String,
        value: String
      }
    ]
  },
  { collection: 'Catalog' }
)

// Create the Catalog Item Model
const CatalogItem = mongoose.model('Catalog_item', CatalogItemSchema)

module.exports = { CatalogItem }
