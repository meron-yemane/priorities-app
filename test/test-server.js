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
  return generateUserData()
  .then(function(userData) {
    Users.create(userData);
  })
  .then(function() {
    const seedData = [];

    for (let i=1; i<=10; i++) {
      seedData.push(generatePriorityData());
    }
    // this will return a promise
    return Priorities.insertMany(seedData);
  })
}

function generatePriorityData() {
  return {
    date_committed: faker.date.past(),
    completed: [true, false][Math.round(Math.random())],
    goal: faker.lorem.sentence(6),
    //username: faker.internet.userName()
  }
}

function generateUserData() {
  return Users.hashPassword("password")
        .then(function(hash) {
            return { username: "meron93", password: hash };
        })


  //return {
    //username: "meron93",
    //firstName: "Meron",
    //lastName: "Yemane",
    //password: "password"
  //}

  // chai.request(app)
  // .post('/users')
  // .send({
  //   username: "meron93",
  //   firstName: "Meron",
  //   lastName: "Yemane",
  //   password: "password"
  // });

  //return Users.hashPassword("password")
    //.then(function(hash) {
      //return {
        //username: "meron93",
        //password: hash
      //};
    //})
    //.then(function(user) {
      //return Users.create(user)
    //})
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
    seedPriorityData()
    .then(function() {
      chai.request(app)
        .post('/users/login')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'name=cookie-monster')
        .send({username: 'meron93', password: 'password'})
        .end(function(err, res) {
          Cookies = 'cookie-monster'
          done();
        })
    });
      //.then(function() {
        //chai.request(app)
        //  .post('/users')

      //})



    //const newUser = generateUserData();
    //chai.request(app).post('/users').send(newUser);
    //return seedPriorityData();
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
        req.cookies = Cookies;
        req.send(priorityData)
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
