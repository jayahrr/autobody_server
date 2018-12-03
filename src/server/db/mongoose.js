const mongoose = require('mongoose')
const extend = require('mongoose-schema-extend')
const Schema = mongoose.Schema
const pusher = require('../config/config')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection Error:'))

db.once('open', () => {
  if (process.env.NODE_ENV !== 'test') {
    const requestsCollection = db.collection('Requests')
    requestsCollection.createIndex({ service_location: '2dsphere' })
    const changeStream = requestsCollection.watch()

    changeStream.on('change', change => {
      const request = change.fullDocument || change.documentKey
      const channel = request ? `REQ_${request._id}` : ''

      switch (change.operationType) {
      case 'insert':
        pusher.trigger(channel, 'inserted', {
          id: request._id,
          request: request
        })
        break

      case 'delete':
        pusher.trigger(channel, 'deleted', request._id)
        break

      case 'replace' || 'update':
        pusher.trigger(channel, 'updated', {
          id: request._id,
          request: request
        })
        break

      default:
        break
      }
    })
  }
})

module.exports = { mongoose, extend, Schema, pusher }
