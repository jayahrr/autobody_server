const _     = require('lodash'),
  { User }  = require('./../models/user.model')

exports.customers = ( req, res ) => {
  let body = _.pick( req.body, [ 'username', 'password' ])
  if ( !body.username || !body.password ) {
    return res.status( 400 ).send({ message: 'Missing required parameter(s)'})
  }
  User.findByCredentials( body.username, body.password ).then(( user ) => {
    res.send( user )
  }).catch(() => {
    res.status( 400 ).send()
  })
}

exports.serviceProviders = ( req, res ) => {
  res.send({ message: 'Logging in Service Provider' })
}