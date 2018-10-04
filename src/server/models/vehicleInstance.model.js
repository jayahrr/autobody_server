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

    title: {
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
      ref: 'Users',
      type: Schema.ObjectId,
      required: true
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
  if (!ObjectId.isValid(vehicle.owner)) {
    vehicle.owner = ObjectId(vehicle.owner)
  }

  if (!this.current_location && this.owner.primary_location) {
    this.current_location = this.owner.primary_location
  }
  next()
})

VehicleInstanceSchema.post('save', function() {
  let vehicle = this
  if (!Number(vehicle.__v)) {
    Customer.findByIdAndUpdate(vehicle.owner).exec(function(err, doc) {
      doc.vehicle_instances.push(vehicle.owner)
      doc
        .save()
        .catch(e =>
          console.log(
            'Something when wrong when updating vehicle instances\' related customer record',
            e
          )
        )
    })
  }
})

VehicleInstanceSchema.pre('remove', function(next) {
  let vehicleInstance = this

  function findAMatchAndSplice(doc) {
    doc.vehicle_instances.forEach(instance => {
      if (doc.vehicle_instances[instance] == vehicleInstance.id) {
        doc.vehicle_instances.splice(instance, 1)
        doc
          .save()
          .catch(e =>
            console.log('Something went wrong removing owner ids!', e)
          )
      }
    })
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
