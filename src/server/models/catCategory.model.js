const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Service Category Schema
const CatalogCategorySchema = BaseSchema.extend(
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
      default: 'category'
    },
    catalog: {
      ref: 'Catalog',
      type: Schema.ObjectId
    },
    child_categories: [
      {
        category_id: { ref: 'Catalog', type: Schema.ObjectId }
      }
    ],
    parent_categories: [
      {
        category_id: { ref: 'Catalog', type: Schema.ObjectId }
      }
    ],
    items: [
      {
        catalog_item_id: { ref: 'Catalog', type: Schema.ObjectId }
      }
    ]
  },
  { collection: 'Catalog' }
)

// Create the Service Category Model
const CatalogCategory = mongoose.model(
  'Catalog_category',
  CatalogCategorySchema
)

module.exports = { CatalogCategory }
