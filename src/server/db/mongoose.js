const mongoose = require('mongoose')
const extend = require('mongoose-schema-extend')
const Schema = mongoose.Schema
const Pusher = require('pusher')

const channel = 'Requests'
const pusher = new Pusher({
  appId: '587597',
  key: 'cb51a4975819a45202cf',
  secret: '98a064b53634d4fcbb9f',
  cluster: 'us2',
  encrypted: true
})

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection Error:'))

db.once('open', () => {
  if (process.env.NODE_ENV !== 'test') {
    const requestsCollection = db.collection('Requests')
    const changeStream = requestsCollection.watch()

    changeStream.on('change', change => {
      if (change.operationType === 'insert') {
        const request = change.fullDocument
        if (request.type !== 'request') return
        pusher.trigger(channel, 'inserted', {
          id: request._id,
          request: request
        })
      } else if (change.operationType === 'delete') {
        pusher.trigger(channel, 'deleted', change.documentKey._id)
      } else if (change.operationType === 'replace') {
        const request = change.fullDocument
        if (request.type !== 'request') return
        pusher.trigger(channel, 'updated', {
          id: request._id,
          request: request
        })
      }
    })
  }
})

module.exports = { mongoose, extend, Schema }
