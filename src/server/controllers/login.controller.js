const _     = require('lodash'),
  { User }  = require('./../models/user.model')

exports.customers = ( req, res ) => {
  let body = _.pick( req.body, [ 'username', 'password' ])
  if ( !body.username || !body.password ) {
    return res.status( 400 ).send({ message: 'Missing required parameter(s)'})
  }
  User.findByCredentials( body.username, body.password ).then(( user ) => {
    if ( user.tokens.length === 0 ) {
      return user.generateAuthToken()
    } else {
      return res.send({ message: 'This account is already logged in' })
    }
  }).then(( token ) => {
    res.status( 201 ).header( 'x-auth', token ).send()
  }).catch(() => {
    res.status( 400 ).send()
  })
}

exports.serviceProviders = ( req, res ) => {
  res.send({ message: 'Logging in Service Provider' })
}