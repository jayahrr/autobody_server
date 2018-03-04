const app = require('./../server').app,
  request = require('supertest'),
  // assert  = require('assert'),
  { ObjectID } = require('mongodb'),
  { Customer } = require('./../models/user.model'),
  { Vehicle } = require('./../models/vehicle.model'),
  { Catalog } = require('./../models/catalog.model'),
  { CatalogCategory } = require('./../models/catCategory.model'),
  { CatalogItem } = require('./../models/catItem.model'),
  { Request } = require('./../models/request'),
  { RequestItem } = require('./../models/requestItem')

const Customers = [
  {
    _id: new ObjectID(),
    first_name: 'jane',
    last_name: 'smith',
    email: 'jane@example.com',
    phone: '555-555-5555',
    password: 'abc123'
  },
  {
    _id: new ObjectID(),
    first_name: 'joe',
    last_name: 'smith',
    email: 'joe@example.com',
    phone: '555-555-4444',
    password: 'abc123'
  },
  {
    _id: new ObjectID(),
    first_name: 'jack',
    last_name: 'smith',
    email: 'jack@example.com',
    phone: '555-555-3333',
    password: 'abc123'
  }
]

const Vehicles = [
  {
    _id: new ObjectID(),
    manufacturer: 'Honda Motors',
    make: 'Honda',
    model: 'Civic',
    year: '1999',
    class: 'EX'
  },
  {
    _id: new ObjectID(),
    manufacturer: 'Toyota',
    make: 'Toyota',
    model: 'Camry',
    year: '2016',
    class: 'Sport'
  },
  {
    _id: new ObjectID(),
    manufacturer: 'BMW',
    make: 'BMW',
    model: 'M1',
    year: '2015',
    class: 'AMG'
  }
]

const Catalogs = [
  {
    _id: new ObjectID(),
    order: 0,
    title: 'AutoBuddy Catalog',
    description:
      'A service catalog containing all the services that AutoBuddy\'s can provide.'
  }
]

const CatalogCategories = [
  {
    _id: new ObjectID(),
    order: 0,
    title: 'Engine Maintenance',
    description:
      'Services related to the improvement or maintenance of the vehicle\'s engine',
    catalog: Catalogs[0]._id
  },
  {
    _id: new ObjectID(),
    order: 1,
    title: 'Tires',
    description:
      'Services related to the improvement or maintenance of the vehicle\'s tires',
    catalog: Catalogs[0]._id
  },
  {
    _id: new ObjectID(),
    order: 2,
    title: 'Autobody maintenance',
    description:
      'Services related to the improvement or maintenance of the vehicle\'s body parts',
    catalog: Catalogs[0]._id
  }
]

const CatalogItems = [
  {
    _id: new ObjectID(),
    order: 0,
    title: 'Oil change',
    description: 'Have the oil for your vehicle changed',
    categories: [CatalogCategories[0]._id]
  },
  {
    _id: new ObjectID(),
    order: 0,
    title: 'Change a tire',
    description: 'Replace a tire on your vehicle',
    categories: [CatalogCategories[1]._id]
  },
  {
    _id: new ObjectID(),
    order: 0,
    title: 'Fix broken door handle',
    description: 'Replace, fix, or remove your vehicle\'s door handle',
    categories: [CatalogCategories[2]._id]
  }
]

const Requests = [
  {
    _id: new ObjectID(),
    number: 'REQ0001001',
    state: 'New',
    requester_id: Customers[0]._id
  },
  {
    _id: new ObjectID(),
    number: 'REQ0001002',
    state: 'New',
    requester_id: Customers[0]._id
  },
  {
    _id: new ObjectID(),
    number: 'REQ0001003',
    state: 'New',
    requester_id: Customers[1]._id
  }
]

const RequestItems = [
  {
    _id: new ObjectID(),
    number: 'RITM0001001',
    short_description: CatalogItems[0].title,
    description: '',
    state: 'New',
    request_id: Requests[0]._id,
    catalog_item_id: CatalogItems[0]._id
  },
  {
    _id: new ObjectID(),
    number: 'RITM0001002',
    short_description: CatalogItems[1].title,
    description: 'Testing description 00',
    state: 'New',
    request_id: Requests[1]._id,
    catalog_item_id: CatalogItems[1]._id
  },
  {
    _id: new ObjectID(),
    number: 'RITM0001003',
    short_description: CatalogItems[2].title,
    description: 'Testing more descriptions 00',
    state: 'New',
    request_id: Requests[2]._id,
    catalog_item_id: CatalogItems[2]._id
  }
]

before(done => {
  Customer.remove({}).then(() => {
    return Customer.create(Customers)
  })

  Vehicle.remove({}).then(() => {
    return Vehicle.insertMany(Vehicles)
  })

  Catalog.remove({}).then(() => {
    return Catalog.insertMany(Catalogs)
  })

  CatalogCategory.remove({}).then(() => {
    return CatalogCategory.insertMany(CatalogCategories)
  })

  CatalogItem.remove({}).then(() => {
    return CatalogItem.insertMany(CatalogItems)
  })

  Request.remove({}).then(() => {
    return Request.insertMany(Requests)
  })

  RequestItem.remove({})
    .then(() => {
      return RequestItem.insertMany(RequestItems)
    })
    .then(() => done())
})

describe('SEEDING DATABASE', () => {
  it('should return a login router site message', done => {
    request(app)
      .get('/login/')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.message != 'hooray! welcome to our router site!') {
          throw new Error(
            `Message content is incorrect; found '${res.body.message}' instead`
          )
        }
      })
      .expect(200, done)
  })

  it('should return 3 new customer records', done => {
    request(app)
      .get('/api/v1/customers')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 3) {
          throw new Error(
            `Customers found is ${res.body.length} instead of the expected 3.`
          )
        }
      })
      .expect(200, done)
  })

  it('should return 3 new vehicle records', done => {
    request(app)
      .get('/api/v1/vehicles')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 3) {
          throw new Error(
            `Vehicles found is ${res.body.length} instead of the expected 3.`
          )
        }
      })
      .expect(200, done)
  })

  it('should return 1 new catalog record', done => {
    request(app)
      .get('/api/v1/catalog')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 1) {
          throw new Error(
            `Catalogs found is ${res.body.length} instead of the expected 1.`
          )
        }
      })
      .expect(200, done)
  })

  it('should return 3 new catalog category records', done => {
    request(app)
      .get('/api/v1/catalog_categories')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 3) {
          throw new Error(
            `Catalog Categories found is ${
              res.body.length
            } instead of the expected 3.`
          )
        }
      })
      .expect(200, done)
  })

  it('should return 3 new catalog item records', done => {
    request(app)
      .get('/api/v1/catalog_items')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 3) {
          throw new Error(
            `Catalog Items found is ${
              res.body.length
            } instead of the expected 3.`
          )
        }
      })
      .expect(200, done)
  })

  it('should return 3 new request records', done => {
    request(app)
      .get('/api/v1/requests')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 3) {
          throw new Error(
            `Requests found is ${res.body.length} instead of the expected 3.`
          )
        }
      })
      .expect(200, done)
  })

  it('should return 3 new request item records', done => {
    request(app)
      .get('/api/v1/requestItems')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 3) {
          throw new Error(
            `Request Items found is ${
              res.body.length
            } instead of the expected 3.`
          )
        }
      })
      .expect(200, done)
  })
})
