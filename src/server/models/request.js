const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Service Request Schema
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
    state: {
      type: String,
      default: 'New'
    },
    requester_id: {
      ref: 'Users',
      type: Schema.ObjectId
    },
    requester_vehicle_id: {
      ref: 'VehicleInstances',
      type: Schema.ObjectId
    },
    request_items: [{ type: String }],
    service_date: {
      type: String,
      default: ''
    },
    service_location: {
      type: String,
      default: ''
    },
    short_description: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'request'
    }
  },
  { collection: 'Requests' }
)

// Create the Service Request Model
const Request = mongoose.model('Request', RequestSchema)

module.exports = { Request }
