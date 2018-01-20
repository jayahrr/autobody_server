const { mongoose, extend, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Service Schema
const ServiceSchema = BaseSchema.extend({
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: ''
  },
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  description: {
    type: String,
    default: ''
  },
  category: [{
    type: Schema.ObjectId,
    ref: 'service_category'
  }],
  price: {
    type: Number,
    default: ''
  },
  estimated_duration: {
    type: Number,
    default: ''
  },
  image: Buffer
}, { collections: 'service' })

// Create the Service Model
const Service = mongoose.model('service', ServiceSchema)

module.exports = {Service}
