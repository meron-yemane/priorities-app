const chai = require('chai');
const chaiHttp = require('chai-http');
const {Priorities, Users} = require('../models');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const should = chai.should();
const {TEST_DATABASE_URL} = require('../config');



chai.use(chaiHttp);

function seedPriorityData() {
  //return generateUserData()
  // .then(function(userData) {
  //   Users.create(userData);
  // })

  //.then(function() {
    //const seedData = [];

  for (let i=1; i<=5; i++) {
    return chai.request(app)
      .post('/priorities/create')
      .send(generatePriorityData())
  }
}

function generatePriorityData() {
  return {
    date_committed: faker.date.past(),
    completed: [true, false][Math.round(Math.random())],
    goal: faker.lorem.sentence(6)
  }
}

function generateUserData() {
  return Users.hashPassword("password")
        .then(function(hash) {
            return { username: "meron93", password: hash };
        })
        .then(function(userData) {
          Users.create(userData);
        })
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

var Cookies;

describe('Priority API resources', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function(done) {
    //seedPriorityData()
    generateUserData()
    .then(function() {
      chai.request(app)
        .post('/users/login')
        .set('Content-Type', 'application/json')
        //.set('Cookie', 'name=cookie-monster')
        .send({username: 'meron93', password: 'password'})
        .end(function(err, res) {
          console.log("res.headers" + res.headers['set-cookie'])
          Cookies = res.headers['set-cookie'].pop().split(';')[0].split('=')[1];
          done();
        })
    })
    .then(function() {
      seedPriorityData();  
    })
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  })

  describe('GET endpoint', function() {

    it('should list all priorities for user', function() {
      var req = chai.request(app).get('/priorities/all');
        let res;
        req.cookies = Cookies;
        console.log("cookies: " + req.cookies);
        return req.then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.be.above(0);
          });
    });
  });

  describe('POST endpoint', function() {

    it('should add a user', function() {
      const newUser = {
        username: "Steve",
        firstName: "Steve",
        lastName: "Karl",
        password: "password"
      }

      return chai.request(app)
        .post('/users')
        .send(newUser)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.should.be.a('object');
          res.body.should.include.keys(
            'username', 'firstName', 'lastName');
          res.body.username.should.equal(newUser.username);
          res.body.firstName.should.equal(newUser.firstName);
          res.body.lastName.should.equal(newUser.lastName);
        });
    });

    it('should login existing user', function() {

      return chai.request(app)
        .post('/users/login')
        .set('contentType', 'application/json')
        .send({
          username: "meron93",
          password: "password"
        })
        .then(function(res) {
          res.should.have.status(200);
        });
    });

    it('should add a priority', function() {
      priorityData = generatePriorityData();
      return chai.request(app)
        .post('/priorities/create')
        req.cookies = Cookies
        .send(priorityData)
        .then(function(res) {

          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            '_id', 'completed', 'goal', 'date_committed');
          res.body.goal.should.equal(newPriority.goal);
          res.body.completed.should.equal(newPriority.completed);
          res.body._id.should.not.be.null;

        });

    });
  });

  describe('DELETE endpoint', function() {

    it('should delete todays priority', function() {
      let priority;
      return Priorities
        .findOne()
        .exec()
        .then(function(_priority) {
          console.log("priotity: " + _priority)
          priority = _priority;
          return chai.request(app).delete(`/priorities/${priority._id}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Priorities.findById(priority._id).exec();
        })
        .then(function(_priority) {
          should.not.exist(_priority);
        });
    });
  });

  describe('PUT endpoint', function() {

    it('should update goal field you send over', function() {
      const updateData = {
        goal: 'Get 10 numbers',
      };

      return Priorities 
      .findOne()
      .exec()
      .then(function(priority) {
        updateData.id = priority.id;
        return chai.request(app)
          .put(`/priorities/${priority.id}`)
          .send(updateData);
      })
      .then(function(res) {
        res.should.have.status(204);
        return Priorities.findById(updateData.id).exec();
      })
      .then(function(priority) {
        priority.goal.should.equal(updateData.goal);
      });
    });
  });
});
