// let env = process.env.NODE_ENV || 'development'
let env = 'development' // use this line instead when seeding db

if (env === 'development') {
  process.env.PORT = 3000
  process.env.MONGODB_URI =
    //'mongodb://localhost:27017/AutoBuddyApp?replicaSet=rs'
    'mongodb://127.0.0.1:27017/AutoBuddyApp?replicaSet=rs0'
} else if (env === 'test') {
  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/AutoBuddyAppTest'
}
