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

  if (
    !Number(request.__v) &&
    request.cartItemIds.length &&
    !request.reqItemIds.length
  ) {
    request.reqItemIds = request.cartItemIds
  }

  next()
})

RequestSchema.post('save', function() {
  let request = this
  // run this block on insert
  if (!Number(request.__v)) {
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

    request.cartItemIds.forEach(id => {
      if (!ObjectId.isValid(id)) ObjectId(id)
      data.catalog_item_id = id
      let newRITM = new RequestItem(data)
      newRITM.save().then(doc => {
        request.reqItemIds.push(doc._id)
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
