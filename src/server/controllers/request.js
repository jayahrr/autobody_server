const _ = require('lodash'),
  { Request } = require('./../models/request'),
  { ObjectID } = require('mongodb'),
  apiErrorMsg = (verb, subject, error) => {
    return { message: `Unable to ${verb} the ${subject}`, error }
  }

// POST   create a request
exports.create = (req, res) => {
  let body = _.pick(req.body, [
    'service_date',
    'service_location',
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
        return res.status(400).send('Unable to find Request by ID')
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

exports.findNearbyRequestsByLocation = (req, res) => {
  let { lat, lon, rad } = req.params
  if (!lon || !lat || !rad) {
    return res.status(400).send('Missing required parameters')
  }

  lat = Number(lat)
  lon = Number(lon)
  rad = Number(rad)

  Request.find({
    service_location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        $maxDistance: rad
      }
    }
  }).then(docs => {
    if (!docs || !docs.length)
      return res.status(400).send('Unable to find Requests nearby.')
    res.json(docs)
  })
}
