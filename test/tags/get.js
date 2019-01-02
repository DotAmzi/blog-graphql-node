require("should");
var Q = require('q');
var server = require("../../dist/app").default.server;
var request = require("supertest").agent(server);
var db = require('../../dist/db/models');
let tokenGenerate = '';

describe("Get Tag test", done => {

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

    var newPost = {
      title: "whatever title",
      text: "whatever text",
      photo: "whatever photo",
      id_tag: 1,
      id_user: 1
    }

    db.sequelize.sync({force: true})
      .then(()=> {
        return db.users.create(newUser);
      })
      .then(() => {
        return db.tags.create(newTag1);
      })
      .then(() => {
        return db.tags.create(newTag2);
      })
      .then(() => {
        return db.posts.create(newPost);
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

  it("should get tag with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        query{
          tag(id: 1){
            name
          }
        }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.tag.name.should.equal('tag name');
        done();
      });
  });

  it("should not get tag with id wrong", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        query{
          tag(id: 4){
            name
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Tag not found');
        done();
      });
  });

  it("should get all tags with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        query{
          tags{
            name
          }
        }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.tags[0].name.should.equal('tag name 2');
        done();
      });
  });

  it("should not get tag without token", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": `
        query{
          tags{
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

  describe("fragments from tags", done => {
    it("should posts from tags", done => {
      request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${tokenGenerate}`)
        .send({
          "query": `
          query{
            tag(id: 1){
              posts{
                title
              }
            }
          }
          `
        })
        .end((err, res) => {
          res.body.should.be.json;
          res.body.data.tag.posts[0].title.should.equal('whatever title');
          done();
        });
    });
  });

});