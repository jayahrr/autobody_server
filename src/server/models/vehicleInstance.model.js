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

VehicleInstanceSchema.pre('save', function (next) {
  if (!this.current_location && this.owner.primary_location) this.current_location = this.owner.primary_location
  next()
})

VehicleInstanceSchema.post('save', function (doc) {
  if (this.vehicle) {
    Vehicle.findById(this.vehicle).exec((err, vehicle) => {
      if (err) return handleError(err)
      vehicle.vehicle_instances.push(this._id)
      vehicle.save((err) => {if(err) console.log('Unable to update vehicle object with new instance', err)})
    })
  }
  if (this.owner) {
    Customer.findById(this.owner).exec(function (err, customer) {
      if (err) return handleError(err)
      customer.vehicle_instances.push(this._id)
      customer.save((err) => {if(err) console.log('Unable to update customer object with new instance', err)})
    })
  }
})

// Create the Vehicle Instance Model
const VehicleInstance = mongoose.model('vehicle_instance', VehicleInstanceSchema)

module.exports = { VehicleInstance }
