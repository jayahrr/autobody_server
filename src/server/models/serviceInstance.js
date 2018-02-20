const { mongoose, extend, Schema } = require('../db/mongoose'),
  { BaseSchema } = require('./base'),
  { VehicleInstance } = require('./vehicleInstance.model')


// Create the Service Instance Schema
const ServiceInstanceSchema = BaseSchema.extend({
  active: {
    type: Boolean,
    default: true
  },
  catalog_item: {
    type: Schema.ObjectId,
    ref: 'catalog_item',
    required: true,
    minlength: 1
  },
  category: {
    type: Schema.ObjectId,
    ref: 'catalog_item'
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

ServiceInstanceSchema.pre('save', function ( next ) {
  let serviceInstance = this
  serviceInstance.catalog_category = serviceInstance.catalog_item.category
  
  next()
})

ServiceInstanceSchema.post( 'save', function( next ) {
  let serviceInstance = this

  if ( serviceInstance.vehicle_instance ) {
    VehicleInstance.findByIdAndUpdate( serviceInstance.vehicle_instance, { services: [ serviceInstance._id ]} )
      .catch((e) => {console.log(e)})
  }

  next()
})

// Create the Service Instance Model
const ServiceInstance = mongoose.model('service_instance', ServiceInstanceSchema)

module.exports = { ServiceInstance }
