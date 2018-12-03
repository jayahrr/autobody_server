const Pusher = require('pusher')

// let env = process.env.NODE_ENV || 'development'
let env = 'development' // use this line instead when seeding db

let atlasClusterURL = 'mongodb://SystemAdministrator:'
atlasClusterURL += 'vAtbAkC3Hj774rUB'
atlasClusterURL += '@getmech0-shard-00-00-50hvl.gcp.mongodb.net:27017,'
atlasClusterURL += 'getmech0-shard-00-01-50hvl.gcp.mongodb.net:27017,'
atlasClusterURL +=
  'getmech0-shard-00-02-50hvl.gcp.mongodb.net:27017/gm_test?ssl=true&replicaSet=GetMech0-shard-0&authSource=admin&retryWrites=true'

if (env === 'development') {
  process.env.PORT = 3000
  process.env.MONGODB_URI =
    //'mongodb://localhost:27017/AutoBuddyApp?replicaSet=rs'
    // 'mongodb://127.0.0.1:27017/AutoBuddyApp?replicaSet=rs0'
    atlasClusterURL
} else if (env === 'test') {
  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/AutoBuddyAppTest'
}

// const channel = 'Requests'
const pusher = new Pusher({
  appId: '587597',
  key: 'cb51a4975819a45202cf',
  secret: '98a064b53634d4fcbb9f',
  cluster: 'us2',
  encrypted: true
})

module.exports = { pusher }
