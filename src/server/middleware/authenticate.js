const { Customer } = require('./../models/user.model')

var authenticate = ( req, res, next ) => {
  var token = req.header( 'x-auth' )

  Customer.findByToken( token ).then(( person ) => {
    if ( !person ) {
      return Promise.reject()
    }

    req.person = person
    req.token = token
    next()
  }).catch(() => {
    return res.status( 401 ).send()
  })
}

module.exports = { authenticate }