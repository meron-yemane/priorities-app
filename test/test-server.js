const chai = require('chai');
const chaiHttp = require('chai-http');
const Priorities = require('../models');

const {app, runServer, closeServer} = require('../server');
const should = chai.should();

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

describe('Priorities', function() {
  before(function() {
    Priorities
    .create({
      goal: "Practice web dev for 5 hours",
      completed: true
    })
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  it('should list priorities on GET', function() {
    return chai.request(app);
      .get('/priorities')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        const expectedKeys = ['id', 'completed', 'goal', 'date_committed'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });




});














