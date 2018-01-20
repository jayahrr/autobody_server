const _             = require('lodash')
const { Vehicle }   = require('./../models/vehicle.model')
const { ObjectID }  = require('mongodb')


const apiErrorMsg   = (verb, subject, error) => { 
  return { message: `Unable to ${verb} the ${subject}`, error }
}

// POST   creates a new vehicle
exports.create = (req, res) => {
  if (!req.params.version) return res.status(400).send('No version specified')
  var body = _.pick(req.body, ['manufacturer', 'make', 'model', 'class', 'year'])
  if (req.params.version === '1') {
    var newVehicle = new Vehicle(body)
    newVehicle.save().then((doc) => {
      res.status(201).send(doc)
    }).catch(() => res.status(400).send('Unable to save new Vehicle object'))
  } else return res.status(400).send('Unknown version')
}

// GET    returns many vehicles
exports.listAll = (req, res) => {
  if (!req.params.version) return res.status(400).send('No version specified')
  if (req.params.version === '1') {
    Vehicle.find().then((docs) => {
      res.send({message: `Returning ${docs.length} item(s)`, docs})
    }).catch((e) => res.status(400).send(apiErrorMsg('get', 'vehicles', e)))
  } else return res.status(400).send('Unknown version')
}

// DELETE deletes many vehicles
exports.deleteAll = (req, res) => {
  if (!req.params.version) return res.status(400).send('No version specified')
  if (req.params.version === '1') {
    Vehicle.remove().then((docs) => {
      res.status(204).send({docs})
    }).catch(() => res.status(400).send('Unable to delete all Vehicles'))
  } else return res.status(400).send('Unknown Version')
}

// /api/:version/vehicles/:id

// GET    return a vehicle by id
exports.findById = (req, res) => {
  if (!req.params.version || !req.params.id) return res.status(400).send('Missing version or ID')
  const id = req.params.id
  if (req.params.version === '1') {
    if (ObjectID.isValid(id)) {
      Vehicle.findById(id).then((doc) => {
        if (!doc) return res.status(400).send('Unable to find Vehicle by ID')
        res.send({doc})
      }).catch((e) => res.status(400).send(apiErrorMsg('get', 'vehicle by ID', e)))
    } else return res.status(400).send('Invalid ID')
  } else return res.status(400).send('Unknown Version')
}

// DELETE delete a vehicle by id
exports.findByIdAndRemove = (req, res) => {
  if (!req.params.version || !req.params.id) return res.status(400).send('Missing version or ID')
  const id = req.params.id
  if (req.params.version === '1') {
    if (ObjectID.isValid(id)) {
      Vehicle.findByIdAndRemove(id).then((doc) => {
        res.status(204).send({doc})
      }).catch((e) => res.status(400).send(apiErrorMsg('delete', 'vehicle by ID', e)))
    } else return res.status(400).send('Invalid ID')
  } else return res.status(400).send('Unknown Version')
}