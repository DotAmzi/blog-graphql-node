require("should");
var Q = require('q');
var server = require("../../dist/app").default.server;
var request = require("supertest").agent(server);
var db = require('../../dist/db/models');
let tokenGenerate = '';

describe("Update User test", done => {

  before(done => {
    var newUser1 = {
      name: "User",
      email: "testAuth@test.com",
      password: "123"
    }

    var newUser2 = {
      name: "User2",
      email: "testAuth@test.com2",
      password: "123"
    }

    db.sequelize.sync({force: true})
      .then(()=> {
        return db.users.create(newUser1);
      })
      .then(()=> {
        return db.users.create(newUser2);
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

  it("should be a update user with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
          mutation{
            updateUser(input: {
              name: "testing"
            }){
              name
            }
          }
        `
      })
      .end((err, res) => {
        console.log(res.body)
        res.body.should.be.json;
        res.body.data.updateUser.name.should.equal('testing');
        done();
      });
  });

  it("should not return error when send email equal current email from user current", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updateUser(input: {
            email: "testAuth@test.com"
          }){
            email
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.updateUser.email.should.equal('testAuth@test.com');
        done();
      });
  });

  it("should return error when send email equal current email from user current", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updateUser(input: {
            email: "testAuth@test.com2"
          }){
            email
          }
        }
      `
      })
      .end((err, res) => {
        res.body.errors[0].message.should.equal('Email testAuth@test.com2 already registered');
        done();
      });
  });


  it("should not be a update password user whwen new passwords not equal", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
          mutation{
            updateUserPassword(
              password: "12345674", 
              confirmPassword: "12345671"
              currentPassword: "12345678"
            )
          }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('New Password not equal confirm new Password');
        done();
      });
  });

  it("should be a update password user when current password wrong", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
          mutation{
            updateUserPassword(
              password: "12345671", 
              confirmPassword: "12345671"
              currentPassword: "12345673"
            )
          }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Current password or User invalid');
        done();
      });
  });

  it("should be a update password user with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
          mutation{
            updateUserPassword(
              password: "12345671", 
              confirmPassword: "12345671"
              currentPassword: "123"
            )
          }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.updateUserPassword.should.equal(true);
        done();
      });
  });

});