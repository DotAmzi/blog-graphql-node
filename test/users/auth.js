require("should");
var Q = require('q');
var server = require("../../dist/app").default.server;
var request = require("supertest").agent(server);
var db = require('../../dist/db/models');

describe("Login test", done => {

  before(done => {
    var newUser = {
      name: "User",
      email: "testAuth@test.com",
      password: "123"
    }
    db.sequelize.sync({force: true})
      .then(()=> {
        return db.users.create(newUser);
      })
      .catch(err => {
        console.log('Insert error');
        console.log(err);
        var deferred = Q.defer().resolve;
        return deferred;
      })
      .then(data => {
        done();
      });
  });

  it("should be a create token with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": 'mutation { createToken(email: "testAuth@test.com", password: "123" ), { token, email, id } }'
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.createToken.should.have.property('token');
        done();
      });
  });

  it("should be a not create token with email invalid", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": 'mutation { createToken(email: "testAny@test.com", password: "12345678" ), { token } }'
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Unauthorized, wrong email or password!');
        done();
      });
  });

  it("should be a not create token with password invalid", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": 'mutation { createToken(email: "testAuth@teste.com", password: "12345670" ), { token } }'
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Unauthorized, wrong email or password!');
        done();
      });
  });

});