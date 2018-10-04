const _ = require('lodash')
const { mongoose, Schema } = require('../db/mongoose')
const ObjectId = require('mongodb').ObjectID
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

    actual_start: {
      type: Date
    },

    actual_end: {
      type: Date
    },

    cartItemIds: [{ type: String }],

    closed: {
      type: Date
    },

    description: {
      type: String,
      default: ''
    },

    number: {
      type: String,
      required: true,
      minlength: 1
    },

    planned_start: {
      type: Date
    },

    planned_end: {
      type: Date
    },

    requester_id: {
      ref: 'Users',
      type: Schema.ObjectId
    },

    requester_vehicle_id: {
      ref: 'VehicleInstances',
      type: Schema.ObjectId
    },

    reqItemIds: [{ ref: 'Requests', type: Schema.ObjectId }],

    service_date: {
      type: String,
      default: ''
    },

    service_location: {
      type: Object,
      default: {}
    },

    service_location_address: {
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

    state: {
      type: String,
      default: 'New'
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

  // run this block on insert
  if (request.__v === undefined || Number(request.__v) === 0) {
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

    const ritm = {
      number: 'RITM0002001',
      request_id: request._id,
      requester_id: request.requester_id,
      requester_vehicle_id: request.requester_vehicle_id,
      servicer_id: request.servicer_id
    }

    request.cartItemIds.forEach(id => {
      if (!ObjectId.isValid(id)) ObjectId(id)
      ritm.catalog_item_id = id
      ritm.servicer_id = request.servicer_id
      let newRITM = new RequestItem(ritm)
      return newRITM.save().then(doc => {
        request.reqItemIds.push(doc._id)
        if (request.reqItemIds.length === request.cartItemIds.length) {
          next()
        }
      })
    })
  }
})

RequestSchema.post('remove', function() {
  console.log('POST REMOVE RAN!')
  let request = this

  if (!_.isEmpty(request.reqItemIds)) {
    console.log('found some reqItemIds')
    request.reqItemIds.forEach((reqItemId, index, array) => {
      console.log('deleting .....', reqItemId)
      console.log('valid id .....', ObjectId.isValid(reqItemId))
      RequestItem.findById(reqItemId).exec(doc =>
        console.log('doc is .....', doc)
      )
    })
  }
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
    console.log('found some reqItemIds')
    request.reqItemIds.forEach((reqItemId, index, array) => {
      console.log('reqItemId .....', reqItemId)
      console.log('valid id .....', ObjectId.isValid(reqItemId))
      RequestItem.findOneAndRemove({ _id: reqItemId }).exec(doc =>
        console.log('doc is .....', doc)
      )
      // RequestItem.findByIdAndRemove(reqItemId).then(doc => {
      //   console.log('doc is .....', doc)
      //   doc.remove()
      //   if (index + 1 === array.length) next()
      // })
    })
    next()
  } else {
    next()
  }
})

// Create the Service Request Model
const Request = mongoose.model('request', RequestSchema)

module.exports = { Request }
