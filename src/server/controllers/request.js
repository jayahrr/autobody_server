const _ = require('lodash')
const { Customer } = require('./../models/user.model')
const { Request } = require('./../models/request')
const { RequestItem } = require('./../models/requestItem')
const { ObjectID } = require('mongodb')

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
    'requester_vehicle_id',
    'requester_id'
  ])
  // if (!body.number) {
  //   return res.status(400).send('Missing required parameter(s)')
  // }
  body.number = 'REQ001007'
  let newRequest = new Request(body)
  newRequest
    .save()
    .then(doc => {
      res.status(201).json(doc)
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
exports.findById = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Request.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send(apiErrorMsg('find', 'request by ID', ''))
      }
      res.json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'request by ID', e)))
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
exports.findByIdAndUpdate = (req, res) => {
  const id = req.params.id
  console.log(JSON.stringify(req.body))
  console.log(JSON.stringify(req.params))

  if (!id) {
    return res.status(400).send('Missing version or ID')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Request.findByIdAndUpdate(id, req.body, { new: true })
    .then(doc => {
      console.log(JSON.stringify(doc))
      res.json(doc)
    })
    .catch(e => {
      console.log(e)
      return res.status(400).send(apiErrorMsg('update', 'request by ID', e))
    })
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
    if (!results || !results.length) return null

    // merge ritms into requests array
    if (results.length) {
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
        requests.push(request)
      }
    }
  } catch (error) {
    throw new Error(error)
  }
  return res.json(requests)
}
