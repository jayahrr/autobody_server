const _ = require('lodash')
const { VehicleInstance } = require('./../models/vehicleInstance.model')
const { Request } = require('./../models/request')
const { RequestItem } = require('./../models/requestItem')
const { ObjectID } = require('mongodb')

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

// PUT    update a vehicle instance by id
exports.findByIdAndUpdate = async (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  var body = _.pick(req.body, [
    'name',
    'vin',
    'year',
    'make',
    'model',
    'owner',
    'sys_updated_by',
    'sys_created_by'
  ])

  if (!body.name) {
    return res.status(400).send('Missing required parameter(s)')
  }

  if (typeof body.year !== 'number') {
    body.year = Number(body.year)
  }

  try {
    const vi = await VehicleInstance.findByIdAndUpdate(id, body, {
      new: true
    }).lean()
    if (!vi) {
      return res.status(400).send('Unable to find Vehicle Instance by ID')
    }
    vi.services = await Request.find({ requester_vehicle_id: vi._id }).lean()
    if (vi.services && vi.services.length) {
      for (let index = 0; index < vi.services.length; index++) {
        const service = vi.services[index]
        service.request_items = await RequestItem.find({
          request_id: service._id
        }).lean()
      }
    }
    res.json(vi)
  } catch (error) {
    res.status(400).send(apiErrorMsg('get', 'vehicle instance by ID', error))
    console.log('error: ', error)
  }
}

// DELETE delete a vehicle instance by id
exports.findByIdAndRemove = async (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  try {
    const instance = await VehicleInstance.findOneAndRemove({ _id: id })
    return res.json(instance)
  } catch (error) {
    return apiErrorMsg('delete', 'VehicleInstance', error)
  }
}
