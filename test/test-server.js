const chai = require('chai');
const chaiHttp = require('chai-http');
const Priorities = require('../models');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const should = chai.should();
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

//describe('index.html page', function() {
  //it('exists', function(done) {
  //  chai.request(app)
  //    .get('/')
  //    .end(function(err, res) {
  //      res.should.have.status(200);
        //res.should.be.html;
  //      done();
  //    });
  //});
//});

function seedPriorityData() {
  console.info('seeding priority data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generatePriorityData());
  }
  // this will return a promise
  return Priorities.insertMany(seedData);
}

function generatePriorityData() {
  return {
    date_committed: faker.date.past(),
    completed: [true, false][Math.round(Math.random())],
    goal: faker.lorem.sentence(6)
  }
}



function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Priority API resources', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function() {
    return seedPriorityData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  })

  describe('GET endpoint', function() {

    it('should list all priorities', function() {
      return chai.request(app)
        .get('/priorities/all')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.be.above(0);
          const expectedKeys = ['completed', 'goal', 'date_committed'];
          res.body.forEach(function(item) {
            item.should.be.a('object');
            item.should.include.keys(expectedKeys);
          });
        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a priority', function() {
      const newPriority = generatePriorityData();

      return chai.request(app)
        .post('/priorities/create')
        .send(newPriority)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            '_id', 'completed', 'goal', 'date_committed');
          res.body.goal.should.equal(newPriority.goal);
          res.body.completed.should.equal(newPriority.completed);
          //res.body.date_committed.should.equal(newPriority.date_committed);
          res.body._id.should.not.be.null;

        });

    });
  });
});














