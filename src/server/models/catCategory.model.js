const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')
const { Catalog } = require('./../models/catalog.model')

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
    child_categories: [{ ref: 'Catalog', type: Schema.ObjectId }],
    parent_categories: [{ ref: 'Catalog', type: Schema.ObjectId }],
    cat_items: [{ ref: 'Catalog', type: Schema.ObjectId }]
  },
  { collection: 'Catalog' }
)

CatalogCategorySchema.post('save', function() {
  const category = this

  // add category id to related catalog's categories
  if (category.catalog && !Number(category.__v)) {
    Catalog.findByIdAndUpdate(category.catalog).exec((err, doc) => {
      doc.categories.push(category._id)
      doc.save().catch(e => {
        throw new Error(
          'Error saving request id to related Vehicle Instance.....',
          e
        )
      })
    })
  }
})

// Create the Service Category Model
const CatalogCategory = mongoose.model(
  'Catalog_category',
  CatalogCategorySchema
)

module.exports = { CatalogCategory }
