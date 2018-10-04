const app = require('./../server').app,
  request = require('supertest'),
  // assert  = require('assert'),
  { ObjectID } = require('mongodb'),
  { Customer } = require('./../models/user.model'),
  { Servicer } = require('./../models/user.model'),
  { Vehicle } = require('./../models/vehicle.model'),
  { VehicleInstance } = require('./../models/vehicleInstance.model'),
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
    class: 'EX',
    title: '1999 Honda Civic Ex'
  },
  {
    _id: new ObjectID(),
    manufacturer: 'Toyota',
    make: 'Toyota',
    model: 'Camry',
    year: '2016',
    class: 'Sport',
    title: '2016 Toyota Camry Sport'
  },
  {
    _id: new ObjectID(),
    manufacturer: 'Chevrolet',
    make: 'Chevrolet',
    model: 'Colorado',
    year: '2016',
    class: 'Z71',
    title: '2016 Chevrolet Colorado Z71'
  }
]

const VehicleInstances = [
  {
    _id: new ObjectID(),
    owner: Customers[0]._id,
    name: 'ZoeyD',
    vin: '1GCGSDE36G1106864',
    year: Vehicles[2].year,
    make: Vehicles[2].make,
    model: Vehicles[2].model,
    manufacturer: Vehicles[2].manufacturer,
    title: Vehicles[2].titlem,
    current_location: '8414 Devenir Ave Downey, CA 90242'
  }
]

const Catalogs = [
  {
    _id: new ObjectID(),
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
  },
  {
    _id: new ObjectID(),
    order: 3,
    title: 'Batteries & Electrical',
    description:
      'Services related to the replacement of the vehicle\'s batteries or installment of electric wiring.',
    catalog: Catalogs[0]._id
  }
]

const CatalogItems = [
  {
    _id: new ObjectID(),
    title: 'Oil change',
    description: 'Have the oil for your vehicle changed',
    categories: [CatalogCategories[0]._id],
    price: 4500,
    duration: 2700000
  },
  {
    _id: new ObjectID(),
    title: 'Change a tire',
    description: 'Replace a tire on your vehicle',
    categories: [CatalogCategories[1]._id],
    price: 5000,
    duration: 3600000
  },
  {
    _id: new ObjectID(),
    title: 'Fix broken door handle',
    description: 'Replace, fix, or remove your vehicle\'s door handle',
    categories: [CatalogCategories[2]._id],
    price: 5500,
    duration: 3600000
  },
  {
    _id: new ObjectID(),
    title: 'Battery Replacement',
    description:
      'Replace your car\'s battery.' +
      'Price includes cost of the new battery and disposal of the old one.',
    categories: [CatalogCategories[3]._id],
    price: 5000,
    duration: 1800000
  },
  {
    _id: new ObjectID(),
    title: 'Battery Disposal',
    description: 'Request disposal of an old car battery.',
    categories: [CatalogCategories[3]._id],
    price: 2000,
    duration: 900000
  }
]

const Servicers = [
  {
    _id: new ObjectID(),
    first_name: 'Jack',
    last_name: 'Servicer',
    email: 'servicer_1@example.com',
    phone: '555-555-9999',
    password: 'abc123',
    service_lines: [CatalogItems[0]._id, CatalogItems[1]._id],
    primary_address: '8414 Devenir Ave. Downey, CA 90242',
    primary_location: {
      type: 'Point',
      coordinates: [33.916427, -118.147419]
    }
  },
  {
    _id: new ObjectID(),
    first_name: 'Josh',
    last_name: 'Servicer',
    email: 'servicer_2@example.com',
    phone: '555-555-9999',
    password: 'abc123',
    service_lines: [CatalogItems[2]._id]
  }
]

const Requests = [
  {
    _id: new ObjectID(),
    number: 'REQ0001001',
    state: 'Assigned',
    servicer_id: Servicers[0]._id,
    requester_id: Customers[0]._id,
    requester_vehicle_id: VehicleInstances[0]._id,
    cartItemIds: [
      CatalogItems[0]._id,
      CatalogItems[1]._id,
      CatalogItems[2]._id
    ],
    service_location: {
      type: 'Point',
      coordinates: [-122.03164178878069, 37.337030655817145] // longitude, latitude
    },
    service_date: '2018-09-13T12:30:00.011Z',
    short_description: '3 items',
    description: 'Car is pretty messed up.'
  },
  {
    _id: new ObjectID(),
    number: 'REQ0001002',
    state: 'Assigned',
    servicer_id: Servicers[0]._id,
    requester_id: Customers[0]._id,
    requester_vehicle_id: VehicleInstances[0]._id,
    cartItemIds: [CatalogItems[1]._id, CatalogItems[2]._id],
    service_location: {
      type: 'Point',
      coordinates: [-2.5469, 48.5917]
    },
    service_date: '2018-09-30T12:30:00.011Z',
    short_description: '2 items',
    description: 'Just my typical changes needed.'
  },
  {
    _id: new ObjectID(),
    number: 'REQ0001003',
    state: 'New',
    requester_id: Customers[1]._id,
    requester_vehicle_id: VehicleInstances[0]._id,
    cartItemIds: [CatalogItems[0]._id],
    service_location: {
      type: 'Point',
      coordinates: [-122.0312186, 37.33233141]
    },
    service_date: '2018-09-28T12:30:00.011Z',
    short_description: CatalogItems[0].title,
    description: 'Running low on that juice!'
  }
]

// const RequestItems = [
//   {
//     _id: new ObjectID(),
//     number: 'RITM0001001',
//     short_description: CatalogItems[0].title,
//     description: '',
//     state: 'New',
//     request_id: Requests[0]._id,
//     catalog_item_id: CatalogItems[0]._id
//   },
//   {
//     _id: new ObjectID(),
//     number: 'RITM0001002',
//     short_description: CatalogItems[1].title,
//     description: 'Testing description 00',
//     state: 'New',
//     request_id: Requests[1]._id,
//     catalog_item_id: CatalogItems[1]._id
//   },
//   {
//     _id: new ObjectID(),
//     number: 'RITM0001003',
//     short_description: CatalogItems[2].title,
//     description: 'Testing more descriptions 00',
//     state: 'New',
//     request_id: Requests[2]._id,
//     catalog_item_id: CatalogItems[2]._id
//   }
// ]

before(done => {
  Customer.remove({}).then(() => {
    return Customer.create(Customers)
  })

  Vehicle.remove({}).then(() => {
    return Vehicle.insertMany(Vehicles)
  })

  VehicleInstance.remove({}).then(() => {
    return VehicleInstance.create(VehicleInstances)
  })

  Catalog.remove({}).then(() => {
    return Catalog.insertMany(Catalogs)
  })

  CatalogCategory.remove({}).then(() => {
    return CatalogCategory.create(CatalogCategories)
  })

  CatalogItem.remove({}).then(() => {
    return CatalogItem.create(CatalogItems)
  })

  Request.remove({}).then(() => {
    return Request.create(Requests)
  })

  Servicer.remove({}).then(() => {
    return Servicer.create(Servicers)
  })

  // .then(() => done())

  RequestItem.remove({})
    // .then(() => {
    //   return RequestItem.insertMany(RequestItems)
    // })
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
  it('should return 1 new vehicle instance record', done => {
    request(app)
      .get('/api/v1/vehicleInstances')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 1) {
          throw new Error(
            `Vehicle Instances found is ${
              res.body.length
            } instead of the expected 1.`
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
  it('should return 4 new catalog category records', done => {
    request(app)
      .get('/api/v1/catalog_categories')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 4) {
          throw new Error(
            `Catalog Categories found is ${
              res.body.length
            } instead of the expected 4.`
          )
        }
      })
      .expect(200, done)
  })
  it('should return 5 new catalog item records', done => {
    request(app)
      .get('/api/v1/catalog_items')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 5) {
          throw new Error(
            `Catalog Items found is ${
              res.body.length
            } instead of the expected 5.`
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
  it('should return 6 new request item records', done => {
    request(app)
      .get('/api/v1/requestItems')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 6) {
          throw new Error(
            `Request Items found is ${
              res.body.length
            } instead of the expected 3.`
          )
        }
      })
      .expect(200, done)
  })
  it('should return 2 new servicer records', done => {
    request(app)
      .get('/api/v1/servicers')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function(res) {
        if (res.body.length != 2) {
          throw new Error(
            `Servicers found is ${res.body.length} instead of the expected 2.`
          )
        }
      })
      .expect(200, done)
  })
})
