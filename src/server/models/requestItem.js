const { mongoose, Schema } = require('../db/mongoose')
const { BaseSchema } = require('./base')
const { Request } = require('./request')
const { VehicleInstance } = require('./vehicleInstance.model')

// Create the Service Catalog Schema
const RequestItemSchema = BaseSchema.extend(
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
    short_description: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: 'New'
    },

    servicer_id: {
      ref: 'Users',
      type: Schema.ObjectId
    },

    request_id: {
      ref: 'Requests',
      type: Schema.ObjectId
    },
    requester_id: {
      ref: 'Customers',
      type: Schema.ObjectId
    },
    catalog_item_id: {
      ref: 'Catalog',
      type: Schema.ObjectId
    },
    type: {
      type: String,
      default: 'item'
    }
  },
  { collection: 'Request Items' }
)

// RequestItemSchema.post('save', function() {
//   let reqItem = this

//   if (!reqItem.request_id || reqItem.request_id !== '') {

//   }

//   // run this block on insert
//   if (!Number(reqItem.__v)) {
//     if (reqItem.request_id) {
//       console.log('Request: ', Request)
//       console.log('reqItem.request_id: ', reqItem.request_id)
//       Request.findByIdAndUpdate(reqItem.request_id).exec((err, doc) => {
//         console.log('doc: ', doc)
//         doc.reqItemIds.push(reqItem._id)
//         doc.save().catch(e => {
//           throw new Error(
//             'Error saving request id to related Vehicle Instance.....',
//             e
//           )
//         })
//       })
//     }
//   }
// })

// Create the Service Category Model
const RequestItem = mongoose.model('request_item', RequestItemSchema)

module.exports = { RequestItem }
