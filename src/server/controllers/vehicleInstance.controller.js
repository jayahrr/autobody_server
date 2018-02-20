const _ = require('lodash'),
  { VehicleInstance } = require('./../models/vehicleInstance.model'),
  { ObjectID } = require('mongodb')

const apiErrorMsg = (verb, subject, error) => {
  return { message: `Unable to ${verb} the ${subject}`, error }
}

// GET    returns many vehicle instances
exports.list = (req, res) => {
  VehicleInstance.find()
    .then(docs => {
      res.json(docs)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('get', 'vehicle instances', e))
    )
}

// POST   creates a new vehicle instance
exports.create = (req, res) => {
  // Check for required parameters
  var body = _.pick(req.body, [
    'name',
    'vin',
    'owner',
    'year',
    'make',
    'model',
    'currentLocation'
  ])
  if (!body.name || !body.owner) {
    return res.status(400).send('Missing required parameter(s)')
  }

  // Create the new vehicle instance
  var newVehicleInstance = new VehicleInstance(body)
  newVehicleInstance
    .save()
    .then(doc => {
      res.status(201).json(doc)
    })
    .catch(e => {
      console.log(e)
      return res.status(400).send(apiErrorMsg('post', 'vehicle instance', e))
    })
}

// DELETE deletes many vehicle instances
exports.deleteAll = (req, res) => {
  VehicleInstance.remove()
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('delete', 'vehicle instances', e))
    )
}

// GET    return a vehicle instance by id
exports.findById = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  VehicleInstance.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find Vehicle Instance by ID')
      }
      res.json(doc)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('get', 'vehicle instance by ID', e))
    )
}

// DELETE delete a vehicle instance by id
exports.findByIdAndRemove = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  VehicleInstance.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find Vehicle Instance by ID')
      }

      doc
        .remove()
        .then(() => res.json(doc))
        .catch(e => res.status(400).send(e))
    })
    .catch(e => res.status(400).send(e))
}

// POST create a Customer's Vehicle Instance
exports.createMyVehicle = (req, res) => {
  var body = _.pick(req.body, [
    'name',
    'vin',
    'owner',
    'vehicleInfo',
    'currentLocation'
  ])
  if (!body.name || !body.owner) {
    return res.status(400).send('Missing required parameter(s)')
  }

  console.log(username)
}
