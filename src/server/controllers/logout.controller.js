exports.customers = ( req, res ) => {
  req.user.removeToken( req.token ).then(() => {
    res.status( 200 ).send()
  }).catch(() => {
    res.status( 400 ).send()
  })
}

exports.serviceProviders = ( req, res ) => {
  res.send({ message: 'Logging out Service Provider' })
}