require("should");
var Q = require('q');
var server = require("../../dist/app").default.server;
var request = require("supertest").agent(server);
var db = require('../../dist/db/models');
let tokenGenerate = '';

describe("Create Tag test", done => {

  before(done => {
    var newUser = {
      name: "User",
      email: "testAuth@test.com",
      password: "123",
      years_old: "123",
      cpf: "12345678",
      ambition: "123",
      active: 'enabled'
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
      .then(res => {
        request
          .post('/graphql')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send({
            query:
              'mutation { createToken(email: "testAuth@test.com", password: "123" ), { token } }'
          })
          .end((err, res) => {
            tokenGenerate = res.body.data.createToken.token;
            done();
          });
      });
  });

  it("should be a create tag with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          createTag(input: {
            name: "whatever"
          }){
            name
          }
        }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.createTag.name.should.equal('whatever');
        done();
      });
  });

  it("should not be a create tag when has been created", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          createTag(input: {
            name: "whatever"
          }){
            name
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Tag with name whatever has been created!');
        done();
      });
  });

  it("should not be a get user without token", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": `
        mutation{
          createTag(input: {
            name: "whatever 2"
          }){
            name
          }
        }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.res.statusMessage.should.equal('Token Invalid');
        res.status.should.equal(401);
        done();
      });
  });

});