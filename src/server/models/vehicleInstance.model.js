const { mongoose, extend, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')
const { Vehicle } = require('./vehicle.model')
const { Customer } = require('./user.model')

// Create the Vehicle Instance Schema
const VehicleInstanceSchema = BaseSchema.extend({
  active: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  current_location: {
    type: String,
    default: ''
  },
  vin: {
    type: String,
    uppercase: true,
    maxlength: 20,
    default: ''
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'customer',
    required: true,
    minlength: 1
  },
  vehicle: {
    type: Schema.ObjectId,
    ref: 'vehicle',
    required: true,
    minlength: 1
  },
  services: [{
    type: Schema.ObjectId,
    ref: 'service_instance'
  }],
  last_services: [{
    type: Schema.ObjectId,
    ref: 'service_instance'
  }]
}, { collections: 'vehicle_instance' })

VehicleInstanceSchema.pre('save', function( next ) {
  if (!this.current_location && this.owner.primary_location) {
    this.current_location = this.owner.primary_location
  }
  next()
})

VehicleInstanceSchema.pre( 'remove', function( next ) {
  let vehicleInstance = this
  function findAMatchAndSplice ( doc ) {
    var instance
    for ( instance = 0; instance < doc.vehicle_instances.length; instance++ ) {
      if ( doc.vehicle_instances[instance] == vehicleInstance.id ) {
        doc.vehicle_instances.splice( instance, 1 )
        doc.save().catch(( e ) => console.log( 'Something went wrong removing owner ids!', e ))
      }
    }
  }

  if ( vehicleInstance.owner ) {
    Customer.findByIdAndUpdate( vehicleInstance.owner ).exec( function ( err, doc ) {
      findAMatchAndSplice( doc )
    })
  }

  if ( vehicleInstance.vehicle ) {
    Vehicle.findByIdAndUpdate( vehicleInstance.vehicle ).exec( function ( err, doc ) {
      findAMatchAndSplice( doc )
    })
  }

  next()
})

VehicleInstanceSchema.post( 'save', function() {
  let vehicleInstance = this

  if ( vehicleInstance.vehicle ) {
    Vehicle.findById( vehicleInstance.vehicle ).exec( function( err, vehicle ) {
      vehicle.vehicle_instances.push( vehicleInstance._id )
      vehicle.save(( err ) => {
        if( err ) console.log('Unable to update vehicle object with new instance', err)
      })
    })
  }

  if ( vehicleInstance.owner ) {
    Customer.findById( vehicleInstance.owner ).exec( function( err, customer ) {
      customer.vehicle_instances.push( vehicleInstance._id )
      customer.save(( err ) => {
        if( err ) console.log('Unable to update customer object with new instance', err)
      })
    })
  }
})

// Create the Vehicle Instance Model
const VehicleInstance = mongoose.model('vehicle_instance', VehicleInstanceSchema)

module.exports = { VehicleInstance }
