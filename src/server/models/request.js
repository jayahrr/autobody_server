const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')
const { RequestItem } = require('./../models/requestItem')
const { VehicleInstance } = require('./vehicleInstance.model')

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
    requester_vehicle_id: {
      ref: 'VehicleInstances',
      type: Schema.ObjectId
    },
    request_items: [{ type: String }],
    service_date: {
      type: String,
      default: ''
    },
    service_location: {
      type: String,
      default: ''
    },
    servicer_id: {
      ref: 'Users',
      type: Schema.ObjectId
    },
    short_description: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'request'
    }
  },
  { collection: 'Requests' }
)

RequestSchema.post('save', function(next) {
  let request = this

  if (request.requester_vehicle_id) {
    VehicleInstance.findByIdAndUpdate(request.requester_vehicle_id).exec(
      (err, doc) => {
        doc.services.push(request._id)
        doc.save().catch(e => {
          throw new Error(
            'Error saving request id to related Vehicle Instance.....',
            e
          )
        })
      }
    )
  }

  const data = {}
  data.number = 'RITM0002001'
  data.request_id = request._id
  data.requester_id = request.requester_id
  data.requester_vehicle_id = request.requester_vehicle_id

  request.request_items.forEach(catItemId => {
    data.catalog_item_id = catItemId
    let newRITM = new RequestItem(data)
    newRITM.save()
  })
})

// Create the Service Request Model
const Request = mongoose.model('Request', RequestSchema)

module.exports = { Request }
