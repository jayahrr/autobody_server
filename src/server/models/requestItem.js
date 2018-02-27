const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Service Catalog Schema
const RequestSchema = BaseSchema.extend(
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
    priority: {
      type: String,
      default: '4 - Low'
    },
    request_id: {
      ref: 'Catalog',
      type: Schema.ObjectId
    },
    requester_vehicle_id: {
      ref: 'VehicleInstances',
      type: Schema.ObjectId
    },
    servicer_id: {
      ref: 'Users',
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
const RequestItem = mongoose.model('request_item', RequestSchema)

module.exports = { RequestItem }
