const { mongoose, extend, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Service Instance Schema
const ServiceInstanceInstanceSchema = BaseSchema.extend({
  active: {
    type: Boolean,
    default: true
  },
  service: {
    type: Schema.ObjectId,
    ref: 'service',
    required: true,
    minlength: 1
  },
  service_provider: {
    type: Schema.ObjectId,
    ref: 'service_provider',
    required: true,
    minlength: 1
  },
  service_date: {
    type: Date,
    default: Date.now,
    required: true,
    minlength: 1
  },
  service_location: {
    type: String,
    required: true,
    minlength: 1
  },
  vehicle_instance: {
    type: Schema.ObjectId,
    ref: 'vehicle_instance',
    required: true,
    minlength: 1
  }
}, { collections: 'service_instance' })

// Create the Service Instance Model
const ServiceInstance = mongoose.model('service_instance', ServiceInstanceInstanceSchema)

module.exports = { ServiceInstance }
