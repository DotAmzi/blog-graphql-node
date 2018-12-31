require("should");
var Q = require('q');
var server = require("../../dist/app").default.server;
var request = require("supertest").agent(server);
var db = require('../../dist/db/models');

describe("Create User test", done => {

  before(done => {
    db.sequelize.sync({force: true})
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

  it("should be a create user with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": `
        mutation{
          createUser(input: {
            name: "User Whatever",
            email: "user@whatever.com",
            password: "12345678",
            
          }){
            name
          }
        }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.createUser.name.should.equal('User Whatever');
        done();
      });
  });

  it("should be a not create user when email has been created", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": `
        mutation{
          createUser(input: {
            name: "User Whatever",
            email: "user@whatever.com",
            password: "12345678",
            
          }){
            name
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('User with email user@whatever.com has been created!');
        done();
      });
  });

});