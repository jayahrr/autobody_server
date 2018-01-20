const { mongoose, extend, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Vehicle Schema
const VehicleSchema = BaseSchema.extend({
  manufacturer: {
    type: String,
    trim: true,
    default: ''
  },
  make: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    default: ''
  },
  model: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    default: ''
  },
  class: {
    type: String,
    trim: true,
    default: ''
  },
  year: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    default: ''
  },
  vehicle_instances: [{
    type: Schema.ObjectId,
    ref: 'vehicle_instance'
  }]
}, { collections: 'vehicle' })

// Create the Vehicle Model
const Vehicle = mongoose.model('vehicle', VehicleSchema)

module.exports = { Vehicle }
