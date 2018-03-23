const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')
const { Request } = require('./request')

// Create the Service Catalog Schema
const RequestItemSchema = BaseSchema.extend(
  {
    active: {
      type: Boolean,
      default: true
    },
    number: {
      type: String,
      required: true,
      minlength: 1
    },
    short_description: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: 'New'
    },
    request_id: {
      ref: 'Requests',
      type: Schema.ObjectId
    },
    catalog_item_id: {
      ref: 'Catalog',
      type: Schema.ObjectId
    },
    type: {
      type: String,
      default: 'item'
    }
  },
  { collection: 'Requests' }
)

// Create the Service Category Model
const RequestItem = mongoose.model('request_item', RequestItemSchema)

module.exports = { RequestItem }
