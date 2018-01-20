const _               = require('lodash'),
  { VehicleInstance } = require('./../models/vehicleInstance.model'),
  { ObjectID }        = require('mongodb')

const apiErrorMsg = ( verb, subject, error ) => { 
  return { message: `Unable to ${ verb } the ${ subject }`, error }
}

// GET    returns many vehicle instances
exports.listAll = ( req, res ) => {
  if ( !req.params.version ) 
    return res.status( 400 ).send( 'No version specified' )
  if ( req.params.version === '1' ) {
    VehicleInstance.find().then(( docs ) => {
      res.send({ message: `Returning ${ docs.length } item(s)`, docs })
    }).catch(( e ) => 
      res.status( 400 ).send( apiErrorMsg( 'get', 'vehicle instances', e )))
  } else return res.status( 400 ).send( 'Unknown version' )
}

// POST   creates a new vehicle instance
exports.create = ( req, res ) => {
  if ( !req.params.version ) 
    return res.status( 400 ).send( 'No version specified' )
  var body = _.pick( req.body, [ 'name', 'vin', 'owner', 'vehicle' ])
  if ( req.params.version === '1' ) {
    if ( !body.name || !body.vin || !body.owner || !body.vehicle ) 
      return res.status( 400 ).send( 'Missing required parameter(s)' )
    if ( !ObjectID.isValid( body.owner )) 
      return res.status( 400 ).send( 'Invalid Owner ID' )
    if ( !ObjectID.isValid( body.vehicle )) 
      return res.status( 400 ).send( 'Invalid Vehicle ID' )
    var newVehicleInstance = new VehicleInstance( body )
    newVehicleInstance.save().then(( doc ) => {
      res.status( 201 ).send( doc )
    }).catch(( e ) => res.status( 400 ).send( apiErrorMsg( 'post', 'vehicle instance', e )))
  } else return res.status( 400 ).send( 'Unknown version' )
}

// DELETE deletes many vehicle instances
exports.deleteAll = ( req, res ) => {
  if ( !req.params.version ) 
    return res.status( 400 ).send( 'No version specified' )
  if ( req.params.version === '1' ) {
    VehicleInstance.remove().then(( docs ) => {
      res.status( 204 ).send({ docs })
    }).catch(( e ) => res.status( 400 ).send( apiErrorMsg( 'delete', 'vehicle instances', e )))
  } else return res.status( 400 ).send( 'Unknown Version' )
}

// GET    return a vehicle instance by id
exports.findById = ( req, res ) => {
  if ( !req.params.version || !req.params.id ) 
    return res.status( 400 ).send( 'Missing version or ID' )
  const id = req.params.id
  if ( req.params.version === '1' ) {
    if ( ObjectID.isValid( id )) {
      VehicleInstance.findById( id ).then(( doc ) => {
        if ( !doc ) 
          return res.status( 400 ).send( 'Unable to find Vehicle Instance by ID' )
        res.send({ doc })
      }).catch(( e ) => res.status( 400 ).send( apiErrorMsg( 'get', 'vehicle instance by ID', e )))
    } else return res.status( 400 ).send( 'Invalid ID' )
  } else return res.status( 400 ).send( 'Unknown Version' )
}

// DELETE delete a vehicle instance by id
exports.findByIdAndRemove = ( req, res ) => {
  if ( !req.params.version || !req.params.id ) 
    return res.status( 400 ).send( 'Missing version or id' )
  const id = req.params.id
  if ( req.params.version === '1' ) {
    if ( ObjectID.isValid( id )) {
      VehicleInstance.findByIdAndRemove( id ).then(( doc ) => {
        res.status( 204 ).send({ doc })
      }).catch(( e ) => res.status( 400 ).send( apiErrorMsg( 'delete', 'vehicle instance by ID', e )))
    } else return res.status( 400 ).send( 'Invalid ID' )
  } else return res.status( 400 ).send( 'Unknown Version' )
}