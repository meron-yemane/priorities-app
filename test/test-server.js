const chai = require('chai');
const chaiHttp = require('chai-http');
const {Priorities, Users} = require('../models');
const faker = require('faker');
const mongoose = require('mongoose');
const moment = require('moment');


const {app, runServer, closeServer} = require('../server');
const should = chai.should();
const {TEST_DATABASE_URL} = require('../config');



chai.use(chaiHttp);


function generatePriorities() {
  for (let i=1; i<=5; i++) {
    return chai.request(app)
      .post('/priorities/create')
      .send(generatePriorityData())
  }
}

function generatePriorityData() {
  return {
    date_committed: moment().format("MMM Do YYYY"),
    completed: [true, false][Math.round(Math.random())],
    goal: faker.lorem.sentence(6)
  }
}

function generateUserData() {
  //console.log("inside gen user")
  return Users.hashPassword("password")
        .then(function(hash) {
          return { username: "meron93", password: hash };
        })
        .then(function(userData) {
          return Users.create(userData);
        })
};

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

var Cookies;
var prioritydata;

describe('Priority API resources', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function(done) {
    this.timeout(5000);
    generateUserData()
    .then(function() {
      return Priorities.create({goal: "get this done", completed: "false", date_committed: moment().format("MMM Do YYYY")})
        .then(function(priority) {
          prioritydata = priority
          //console.log("priority: " + priority)
          return Users
          .findOne()
          .then(function(user) {
            //console.log("findOne user: " + user);
            user._priorities.push(prioritydata); 
            //console.log(user)
            user.save().then(function() {
              //console.log("Inside save")
              return user.populate('Priorities')
            }).then(function() {
              //console.log("logging user in")
              chai.request(app)
              .post('/users/login')
              .set('Content-Type', 'application/json')
              //.set('Cookie', 'name=cookie-monster')
              .send({username: 'meron93', password: 'password'})
              .end(function(err, res) {
                //console.log("res.headers" + res.headers['set-cookie']);
                Cookies = res.headers['set-cookie'].pop().split(';');
                done();
                //[0].split('=')[1];
              })
            })
          })
        })
    })
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {
    this.timeout(5000);
    it.only('should list all priorities for user', function() {
      var req = chai.request(app).get('/priorities/all');
        let res;
        req.cookies = Cookies;
        //console.log("cookies: " + req.cookies);
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
      const priorityInfo = generatePriorityData();
      var req = chai.request(app).post('/priorities/create');
      req.cookies = Cookies;
      req.send(priorityInfo);
      return req.then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            '_id', 'completed', 'goal', 'date_committed');
          res.body.goal.should.equal(priorityInfo.goal);
          res.body.completed.should.equal(priorityInfo.completed);
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
