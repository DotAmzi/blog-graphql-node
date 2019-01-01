require("should");
var Q = require('q');
var server = require("../../dist/app").default.server;
var request = require("supertest").agent(server);
var db = require('../../dist/db/models');
let tokenGenerate = '';

describe("Update Tag test", done => {

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

    var newTag1 = {
      name: "tag name"
    }

    var newTag2 = {
      name: "tag name 2"
    }

    db.sequelize.sync({force: true})
      .then(()=> {
        return db.users.create(newUser);
      })
      .then(() => {
        return db.tags.crate(newTag1);
      })
      .then(() => {
        return db.tags.crate(newTag2);
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

  it("should update tag with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updateTag(input: {
            name: "another name"
          }, id: 1){
            name
          }
        }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.updateTag.name.should.equal('another name');
        done();
      });
  });

  it("should update tag name with same value", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updateTag(input: {
            name: "another name"
          }, id: 1){
            name
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.updateTag.name.should.equal('another name');
        done();
      });
  });

  it("should not update tag name with same value from another tag", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updateTag(input: {
            name: "tag name 2"
          }, id: 1){
            name
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Name has been registred on another tag');
        done();
      });
  });

  it("should not update tag name with id wrong", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updateTag(input: {
            name: "another name 5"
          }, id: 3){
            name
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Tag with id 3 not exist!');
        done();
      });
  });

  it("should not update user without token", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": `
        mutation{
          updateTag(input: {
            name: "another name 5"
          }, id: 3){
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