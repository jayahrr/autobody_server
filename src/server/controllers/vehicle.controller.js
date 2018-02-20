const _             = require('lodash')
const { Vehicle }   = require('./../models/vehicle.model')
const { ObjectID }  = require('mongodb')


const apiErrorMsg   = (verb, subject, error) => { 
  return { message: `Unable to ${verb} the ${subject}`, error }
}

// POST   creates a new vehicle
exports.create = ( req, res ) => {
  var body = _.pick( req.body, [ 'manufacturer', 'make', 'model', 'class', 'year' ])
  var newVehicle = new Vehicle( body )
  newVehicle.save()
    .then(( doc ) => {
      res.status( 201 ).json( doc )
    })
    .catch(() => 
      res.status( 400 ).send( 'Unable to save new Vehicle object' ))
}

// GET    returns many vehicles
exports.list = ( req, res ) => {
  Vehicle.find()
    .then(( docs ) => {
      res.json( docs )
    })
    .catch(( e ) => res.status( 400 ).send( apiErrorMsg( 'get', 'vehicles', e )))
}

// DELETE deletes many vehicles
exports.deleteAll = ( req, res ) => {
  Vehicle.remove({})
    .then(( docs ) => {
      res.status( 204 ).json( docs )
    })
    .catch(() => 
      res.status( 400 ).send( 'Unable to delete all Vehicles' ))
}

// /api/:version/vehicles/:id

// GET    return a vehicle by id
exports.findById = ( req, res ) => {
  const id = req.params.id
  if ( !id ) {
    return res.status( 400 ).send( 'Missing version or ID' )
  }

  if ( !ObjectID.isValid( id )) {
    return res.status( 400 ).send( 'Invalid ID' )
  }

  Vehicle.findById( id )
    .then(( doc ) => {
      if ( !doc ) {
        return res.status( 400 ).send( 'Unable to find Vehicle by ID' )
      }
      res.json( doc )
    })
    .catch(( e ) => 
      res.status( 400 ).send( apiErrorMsg( 'get', 'vehicle by ID', e )))
}

// DELETE delete a vehicle by id
exports.findByIdAndRemove = ( req, res ) => {
  const id = req.params.id
  if ( !id ) {
    return res.status( 400 ).send( 'Missing version or ID' )
  }

  if ( !ObjectID.isValid( id )) {
    return res.status( 400 ).send( 'Invalid ID' )
  }

  Vehicle.findByIdAndRemove( id )
    .then(( doc ) => {
      res.status( 204 ).json( doc )
    })
    .catch(( e ) => 
      res.status( 400 ).send( apiErrorMsg( 'delete', 'vehicle by ID', e )))

}