const { Customer } = require('./../models/user.model')

const authenticate = ( req, res, next ) => {
  const token = req.header( 'x-auth' )

  Customer.findByToken( token ).then(( user ) => {
    if ( !user ) {
      return Promise.reject()
    }

    req.user = user
    req.token = token
    next()
  }).catch(() => {
    return res.status( 401 ).send()
  })
}

module.exports = { authenticate }