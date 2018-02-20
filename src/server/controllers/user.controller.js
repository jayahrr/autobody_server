const _ = require('lodash'),
  { Customer } = require('./../models/user.model'),
  { VehicleInstance } = require('./../models/vehicleInstance.model'),
  { ObjectID } = require('mongodb')

const apiErrorMsg = (verb, subject, error) => {
  return { message: `Unable to ${verb} the ${subject}`, error }
}

// POST   create a customer
exports.create = (req, res) => {
  var body = _.pick(req.body, [
    'first_name',
    'last_name',
    'email',
    'phone',
    'username',
    'password'
  ])
  if (!body.first_name || !body.last_name || !body.email || !body.password) {
    return res.status(400).send('Missing required parameter(s)')
  }

  var newCustomer = new Customer(body)
  newCustomer
    .save()
    .then(() => {
      return newCustomer.generateAuthToken()
    })
    .then(token => {
      res
        .status(201)
        .header('x-auth', token)
        .json(newCustomer)
    })
    .catch(e => res.status(400).send(apiErrorMsg('create', 'customer', e)))
}

// GET    list all customers
exports.list = (req, res) => {
  Customer.find()
    .then(docs => {
      res.json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'customers', e)))
}

// DELETE delete all customers
exports.deleteAll = (req, res) => {
  Customer.remove()
    .then(docs => {
      res.status(204).json(docs)
    })
    .catch(e => res.status(400).send(apiErrorMsg('delete', 'customers', e)))
}

// GET find a customer by an ID
exports.findById = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Customer.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find any Customer with this ID')
      }
      res.json(doc)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'customer by ID', e)))
}

// DELETE find a customer by an ID and delete
exports.findByIdAndRemove = (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).send('No ID specified')
  }

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Invalid ID')
  }

  Customer.findByIdAndRemove(id)
    .then(doc => {
      if (!doc) {
        return res.status(400).send('Unable to find any Customer with this ID')
      }
      res.status(204).json(doc)
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('delete', 'customer by ID', e))
    )
}

// GET find a Customer's Vehicle Instances
exports.findMyVehicles = (req, res) => {
  const username = req.header('x-un')

  console.log(username)

  Customer.find({ username })
    .then(customer => {
      const id = customer[0]._id

      VehicleInstance.find({ owner: id })
        .then(myVehicles => {
          if (!myVehicles) {
            return res.send('You have no vehicles')
          }
          res.json(myVehicles)
        })
        .catch(e =>
          res
            .status(400)
            .send(apiErrorMsg('get', 'vehicleInstance by Customer', e))
        )
    })
    .catch(e =>
      res.status(400).send(apiErrorMsg('get', 'customer by Username', e))
    )
}

exports.findMe = (req, res) => {
  if (!req.token) {
    return res.status(400).send({ message: 'No token found in Request' })
  }
  Customer.findByToken(req.token)
    .then(me => {
      if (!me) {
        return res
          .status(400)
          .send({ message: 'No user found by token provided' })
      }

      return res.json(me)
    })
    .catch(e => res.status(400).send(apiErrorMsg('get', 'customer', e)))
}
