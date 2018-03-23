const { mongoose, Schema } = require('../db/mongoose')
const ObjectId = require('mongodb').ObjectID
const { BaseSchema } = require('./base')
const { Vehicle } = require('./vehicle.model')
const { Customer } = require('./user.model')

// Create the Vehicle Instance Schema
const VehicleInstanceSchema = BaseSchema.extend(
  {
    active: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      required: true,
      minlength: 1
    },
    vin: {
      type: String,
      uppercase: true,
      maxlength: 20,
      default: ''
    },
    owner: {
      type: String,
      required: true,
      minlength: 1
    },
    year: {
      type: Number,
      minlength: 4,
      maxlength: 4,
      default: 1970
    },
    make: {
      type: String,
      default: ''
    },
    model: {
      type: String,
      default: ''
    },
    manufacturer: {
      type: String,
      default: ''
    },
    current_location: {
      type: String,
      default: ''
    },
    services: [
      {
        ref: 'Requests',
        type: Schema.ObjectId
      }
    ],
    last_services: [
      {
        ref: 'Requests',
        type: Schema.ObjectId
      }
    ]
  },
  { collection: 'VehicleInstances' }
)

VehicleInstanceSchema.pre('save', function(next) {
  let vehicle = this
  if (vehicle.owner) vehicle.owner = ObjectId(vehicle.owner)
  if (!this.current_location && this.owner.primary_location) {
    this.current_location = this.owner.primary_location
  }
  next()
})

VehicleInstanceSchema.pre('remove', function(next) {
  let vehicleInstance = this

  function findAMatchAndSplice(doc) {
    var instance
    for (instance = 0; instance < doc.vehicle_instances.length; instance++) {
      if (doc.vehicle_instances[instance] == vehicleInstance.id) {
        doc.vehicle_instances.splice(instance, 1)
        doc
          .save()
          .catch(e =>
            console.log('Something went wrong removing owner ids!', e)
          )
      }
    }
  }

  if (vehicleInstance.owner) {
    Customer.findByIdAndUpdate(vehicleInstance.owner).exec(function(err, doc) {
      findAMatchAndSplice(doc)
    })
  }

  if (vehicleInstance.vehicle) {
    Vehicle.findByIdAndUpdate(vehicleInstance.vehicle).exec(function(err, doc) {
      findAMatchAndSplice(doc)
    })
  }

  next()
})

// Create the Vehicle Instance Model
const VehicleInstance = mongoose.model(
  'vehicle_instance',
  VehicleInstanceSchema
)

module.exports = { VehicleInstance }
