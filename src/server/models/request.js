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
    request_items: [
      {
        request_item_id: { ref: 'Requests', type: Schema.ObjectId }
      }
    ],
    type: {
      type: String,
      default: 'request'
    }
  },
  { collection: 'Requests' }
)

// Create the Service Request Model
const Request = mongoose.model('request', RequestSchema)

module.exports = { Request }