const _ = require('lodash')
const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')
const { RequestItem } = require('./requestItem')
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
    cartItemIds: [{ type: String }],
    reqItemIds: [{ ref: 'Requests', type: Schema.ObjectId }],
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

RequestSchema.pre('save', function(next) {
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

  request.cartItemIds.forEach((cartItemId, index, array) => {
    data.catalog_item_id = cartItemId
    let newRITM = new RequestItem(data)
    newRITM.save().then(doc => {
      request.reqItemIds.push(doc._id)
      if (index + 1 === array.length) next()
    })
  })
})

RequestSchema.pre('remove', function(next) {
  let request = this

  if (request.requester_vehicle_id) {
    VehicleInstance.findByIdAndUpdate(request.requester_vehicle_id).exec(
      (err, doc) => {
        for (let index = 0; index < doc.services.length; index++) {
          const serviceID = doc.services[index]
          if (serviceID.toString() === request._id.toString()) {
            doc.services.splice(index, 1)
          }
        }
        doc.save().catch(e => {
          throw new Error(
            'Error deleting service ID from Vehicle Instance.....',
            e
          )
        })
      }
    )
  }

  if (!_.isEmpty(request.reqItemIds)) {
    request.reqItemIds.forEach((reqItemId, index, array) => {
      RequestItem.findByIdAndRemove(reqItemId).then(() => {
        if (index + 1 === array.length) next()
      })
    })
  }
})

// Create the Service Request Model
const Request = mongoose.model('request', RequestSchema)

module.exports = { Request }
