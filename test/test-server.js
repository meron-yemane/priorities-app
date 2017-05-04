const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');

//const app = server.app;
//const storage = server.storage;

const should = chai.should();

chai.use(chaiHttp);

describe('index.html page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        //res.should.be.html;
        done();
      });
  });
});