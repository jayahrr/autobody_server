const app = require('./../server').app,
  request = require('supertest'),
  // assert  = require('assert'),
  { ObjectID } = require('mongodb'),
  { Customer } = require('./../models/user.model'),
  { Vehicle }  = require('./../models/vehicle.model'),
  { CatalogCategory }  = require('./../models/catCategory.model'),
  { CatalogItem } = require('./../models/catItem.model')

const Customers = [{
  first_name:'jane',
  last_name:'smith',
  email:'jane@example.com',
  phone:'555-555-5555',
  password: 'abc123'
},{
  first_name:'joe',
  last_name:'smith',
  email:'joe@example.com',
  phone:'555-555-4444',
  password: 'abc123'
},{
  first_name:'jack',
  last_name:'smith',
  email:'jack@example.com',
  phone:'555-555-3333',
  password: 'abc123'
}]

const Vehicles = [{
  _id: new ObjectID(),
  manufacturer:'Honda Motors',
  make:'Honda',
  model:'Civic',
  year:'1999',
  class:'EX'
},{
  _id: new ObjectID(),
  manufacturer:'Toyota',
  make:'Toyota',
  model:'Camry',
  year:'2016',
  class:'Sport'
},{
  _id: new ObjectID(),
  manufacturer:'BMW',
  make:'BMW',
  model:'M1',
  year:'2015',
  class:'AMG'
}]

const CatalogCategories = [{
  _id: new ObjectID(),
  order: 0,
  name:'Engine Maintenance',
  description:'Services related to the improvement or maintenane of the vehicle\'s engine'
},{
  _id: new ObjectID(),
  order: 1,
  name:'Tires',
  description:'Services related to the improvement or maintenane of the vehicle\'s tires'
},{
  _id: new ObjectID(),
  order: 2,
  name:'Autobody maintenance',
  description:'Services related to the improvement or maintenane of the vehicle\'s body parts'
}]

const CatalogItems = [{
  _id: new ObjectID(),
  order: 0,
  name: 'Oil change',
  description: 'Have the oil for your vehicle changed',
  category: CatalogCategories[0]._id,
  price: 30.00,
  estimated_duration: 3600
},{
  _id: new ObjectID(),
  order: 0,
  name: 'Change a tire',
  description: 'Replace a tire on your vehicle',
  category: CatalogCategories[1]._id,
  price: 25.00,
  estimated_duration: 1800
},{
  _id: new ObjectID(),
  order: 0,
  name: 'Fix broken door handle',
  description: 'Replace, fix, or remove your vehicle\'s door handle',
  category: CatalogCategories[2]._id,
  price: 50.00,
  estimated_duration: 3600
}]


before(( done ) => {
  Customer.remove({})
    .then(() => {
      return Customer.create(Customers)
    })

  Vehicle.remove({})
    .then(() => {
      return Vehicle.insertMany(Vehicles)
    })

  CatalogCategory.remove({})
    .then(() => {
      return CatalogCategory.insertMany(CatalogCategories)
    })

  CatalogItem.remove({})
    .then(() => {
      return CatalogItem.insertMany(CatalogItems)
    })
    .then(() => done())
})

describe('SEEDING DATABASE', () => {

  it('should return a login router site message', (done) => {
    request(app)
      .get('/login/')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function( res ) {
        if ( res.body.message != 'hooray! welcome to our router site!' ) {
          throw new Error(`Message content is incorrect; found '${res.body.message}' instead`)
        }
      })
      .expect(200, done)
  })
  
  it('should return 3 new customer records', (done) => {
    request(app)
      .get('/api/v1/customers')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function( res ) {
        if ( res.body.length != 3 ) {
          throw new Error(`Customers found is ${res.body.length} instead of the expected 3.`)
        }
      })
      .expect(200, done)
  })
  
  it('should return 3 new vehicle records', (done) => {
    request(app)
      .get('/api/v1/vehicles')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function( res ) {
        if ( res.body.length != 3 ) {
          throw new Error(`Vehicles found is ${res.body.length} instead of the expected 3.`)
        }
      })
      .expect(200, done)
  })
  
  it('should return 3 new catalog category records', (done) => {
    request(app)
      .get('/api/v1/catalog_categories')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function( res ) {
        if ( res.body.length != 3 ) {
          throw new Error(`Catalog Categories found is ${res.body.length} instead of the expected 3.`)
        }
      })
      .expect(200, done)
  })
  
  it('should return 3 new catalog item records', (done) => {
    request(app)
      .get('/api/v1/catalog_items')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(function( res ) {
        if ( res.body.length != 3 ) {
          throw new Error(`Catalog Items found is ${res.body.length} instead of the expected 3.`)
        }
      })
      .expect(200, done)
  })

})