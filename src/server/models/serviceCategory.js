const { mongoose, extend } = require('../db/mongoose')
const { BaseSchema } = require('./base')

// Create the Service Category Schema
const ServiceCategorySchema = BaseSchema.extend({
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
  image: Buffer
}, { collections: 'service_category' })

// Create the Service Category Model
const ServiceCategory = mongoose.model('service_category', ServiceCategorySchema)

module.exports = { ServiceCategory }
