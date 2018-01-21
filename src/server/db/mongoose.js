const mongoose  = require('mongoose'),
  extend        = require('mongoose-schema-extend'),
  Schema        = mongoose.Schema

mongoose.Promise = global.Promise
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/AutoBuddyApp' )

module.exports = { mongoose, extend, Schema }