const _             = require('lodash'),
  { Customer }  = require('./../models/user.model'),
  { ObjectID }  = require('mongodb')


const apiErrorMsg = ( verb, subject, error ) => { 
  return { message: `Unable to ${ verb } the ${ subject }`, error }
}

const checkVersion = (version, number, res) => {
  if ( !version ) {
    return res.status( 400 ).send( { message: 'No version specified'} )
  } else if ( version != number ) {
    return res.status( 400 ).send( { message: 'Invalid version specified'} )
  }
}

// POST   create a customer
exports.create = ( req, res ) => {
  checkVersion( req.params.version, '1', res )
  var body = _.pick( req.body, [ 'first_name', 'last_name', 'email', 'phone', 'username', 'password' ])
  if ( !body.first_name || !body.last_name || !body.email || !body.password ) {
    return res.status( 400 ).send( {message: 'Missing required parameter(s)'} )
  }
  var newCustomer = new Customer( body )
  newCustomer.save().then(() => {
    return newCustomer.generateAuthToken()
  }).then(( token ) => {
    res.status( 201 ).header( 'x-auth', token ).send( newCustomer )
  }).catch(( e ) => 
    res.status( 400 ).send( apiErrorMsg( 'create', 'customer', e )))
}

// GET    list all customers
exports.listAll = ( req, res ) => {
  checkVersion( req.params.version, '1', res )
  Customer.find().then(( docs ) => {
    res.send({ message: `Returning ${ docs.length } item(s)`, docs })
  }).catch(( e ) => 
    res.status( 400 ).send( apiErrorMsg( 'get', 'customers', e )))
}

// DELETE delete all customers
exports.deleteAll = ( req, res ) => {
  checkVersion( req.params.version, '1', res )
  if ( req.params.version === '1' ) {
    Customer.remove().then(( docs ) => {
      res.status( 204 ).send({ docs })
    }).catch(( e ) => 
      res.status( 400 ).send( apiErrorMsg( 'delete', 'customers', e )))
  } else return res.status( 400 ).send( 'Unknown Version' )
}

// GET find a customer by an ID
exports.findById = ( req,res ) => {
  if ( !req.params.version || !req.params.id ) {
    return res.status( 400 ).send( 'No version or ID specified' )
  }
  const id = req.params.id
  if ( req.params.version === '1' ) {
    if ( ObjectID.isValid( id )) {
      Customer.findById( id ).then(( doc ) => {
        if ( !doc ) {
          return res.status( 400 ).send( 'Unable to find any Customer with this ID' )
        }
        res.send({ doc })
      }).catch(( e ) => 
        res.status( 400 ).send( apiErrorMsg( 'get', 'customer by ID', e )))
    } else return res.status( 400 ).send( 'Invalid ID' )
  } else return res.status( 400 ).send( 'Unknown Version' )
}

// DELETE find a customer by an ID and delete
exports.findByIdAndRemove = ( req, res ) => {
  if ( !req.params.version || !req.params.id ) {
    return res.status( 400 ).send( 'No version or ID specified' )
  }
  const id = req.params.id
  if ( req.params.version === '1' ) {
    if ( ObjectID.isValid( id )) {
      Customer.findByIdAndRemove( id ).then(( doc ) => {
        if ( !doc ) {
          return res.status( 400 ).send( 'Unable to find any Customer with this ID' )
        }
        res.status( 204 ).send({ doc })
      }).catch(( e ) => 
        res.status( 400 ).send( apiErrorMsg( 'delete', 'customer by ID', e )))
    } else return res.status( 400 ).send( 'Invalid ID' )
  } else return res.status( 400 ).send( 'Unknown Version' )
}