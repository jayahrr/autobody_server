const _ = require('lodash')
const { Customer } = require('./../models/user.model')
const { Request } = require('./../models/request')
const { RequestItem } = require('./../models/requestItem')
const { VehicleInstance } = require('./../models/vehicleInstance.model')
const { ObjectID } = require('mongodb')
const { pusher } = require('../config/config')

const apiErrorMsg = (verb, subject, error) => {
  return { message: `Unable to ${verb} the ${subject}`, error }
}

// POST   create a request
exports.create = (req, res) => {
  let body = _.pick(req.body, [
    'service_date',
    'service_location',
    'service_location_address',
    'short_description',
    'description',
    'requester_vehicle_id',
    'requester_id',
    'cost_estimate'
  ])

  body.cost_estimate = Number(body.cost_estimate)
  body.number = `REQ100${Math.floor(Math.random() * 10 + 1)}`
  body.sys_created_by = body.sys_updated_by = body.requester_id

  let newRequest = new Request(body)
  newRequest
    .save()
    .then(doc => {
      res.status(201).json(doc)
      pusher.trigger('Requests', 'inserted', { request: doc })
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'request', e)))
}

// GET    list all requests
exports.list = (req, res) => {
  Request.find({ type: 'request' })
    .then(docs => {
      res.json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'requests', e)))
}

// DELETE delete all requests
exports.deleteAll = (req, res) => {
  Request.remove({ type: 'request' })
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'requests', e)))
}

// GET    return a request by id
exports.findById = async (req, res) => {
  const reqID = req.params.id
  if (!reqID) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(reqID)) {
    return res.status(400).send('Invalid ID')
  }

  try {
    const request = await Request.findById(reqID).lean()
    if (!request) {
      return res.status(400).send(apiErrorMsg('find', 'request by ID', ''))
    }
    // acquire RITM objects and set to property request_items
    const ritms = (request.request_items = [])
    const ritmIDs = request.reqItemIds
    if (ritmIDs && ritmIDs.length > 0) {
      for (let index = 0; index < ritmIDs.length; index++) {
        const ritmID = ritmIDs[index]
        const ritm = await RequestItem.findById(ritmID)
        if (ritm) {
          ritms.push(ritm)
        }
      }
    }
    // acquire REQUESTER object and set to property requester
    const requesterID = request.requester_id
    if (requesterID) {
      const requester = await Customer.findById(requesterID)
      request.requester = requester
    }
    // acquire REQUESTER VEHICLE object and set to property requester_vehicle
    const vehicleID = request.requester_vehicle_id
    if (vehicleID) {
      const vehicle = await VehicleInstance.findById(vehicleID)
      request.requester_vehicle = vehicle
    }
    // respond with request object
    res.json(request)
  } catch (error) {
    res.status(400).send(apiErrorMsg('get', 'request by ID', error))
  }
}

// DELETE delete a request by id
exports.findByIdAndRemove = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Request.findByIdAndRemove(id)
    .then(doc => {
      doc.remove()
      res.status(204).json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'request by ID', e)))
}

// DELETE delete a request by id
exports.findByIdAndUpdate = async (req, res) => {
  let reqID = req.params.id
  const updater = req.body.sys_updated_by

  if (!reqID) {
    return res
      .status(400)
      .send({ error: true, message: 'Missing version or Request ID' })
  }

  if (!ObjectID.isValid(reqID)) {
    return res.status(400).send({ error: true, message: 'Invalid Request ID' })
  }

  if (updater && !ObjectID.isValid(updater)) {
    return res.status(400).send({ error: true, message: 'Invalid Updater ID' })
  }

  try {
    const updatedRequest = await Request.findByIdAndUpdate(reqID, req.body, {
      new: true
    }).lean()
    reqID = updatedRequest._id
    updatedRequest.request_items = await RequestItem.find({
      request_id: reqID,
      active: true
    }).lean()
    res.json(updatedRequest)
    pusher.trigger('REQ_' + reqID, 'updated', updatedRequest)
  } catch (error) {
    return res.status(400).send(apiErrorMsg('update', 'request by ID', error))
  }
}

exports.findNearbyRequestsByLocation = async (req, res) => {
  let requests = []

  let { lat, lon, rad } = req.params
  if (!lon || !lat || !rad) {
    return res.status(400).send('Missing required parameters')
  }
  lat = Number(lat)
  lon = Number(lon)
  rad = Number(rad)

  try {
    const results = await Request.find({
      active: true,
      state: 'New',
      service_location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          $maxDistance: rad
        }
      }
    }).lean()

    // merge ritms into requests array
    if (results && results.length) {
      for (let index = 0; index < results.length; index++) {
        const request = results[index]
        if (request.reqItemIds.length !== 0) {
          request.request_items = await RequestItem.find({
            request_id: request._id
          })
        }
        if (request.requester_id) {
          request.requester = await Customer.findById(request.requester_id)
        }
        if (request.requester_vehicle_id) {
          request.requester_vehicle = await VehicleInstance.findById(
            request.requester_vehicle_id
          )
        }
        requests.push(request)
      }
    }
  } catch (error) {
    throw new Error(error)
  }
  return res.json(requests)
}
