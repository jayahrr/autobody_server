const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')
const { CatalogCategory } = require('./../models/catCategory.model')

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

    price: {
      type: Number,
      default: 0 // need to store as cents
    },

    duration: {
      type: Number,
      default: 0 // need to store as milliseconds
    },

    thumbnail: Buffer,

    type: {
      type: String,
      default: 'cat_item'
    },

    categories: [{ ref: 'Catalog', type: Schema.ObjectId }],

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

CatalogItemSchema.post('save', function() {
  const catItem = this
  if (catItem.categories.length) {
    catItem.categories.forEach(catId => {
      CatalogCategory.findByIdAndUpdate(catId).exec((err, doc) => {
        doc.cat_items.push(catItem._id)
        doc.save().catch(e => {
          throw new Error(
            'Error saving cat item id to related Category.....',
            e
          )
        })
      })
    })
  }
})

// Create the Catalog Item Model
const CatalogItem = mongoose.model('Catalog_item', CatalogItemSchema)

module.exports = { CatalogItem }
