require("should");
var Q = require('q');
var server = require("../../dist/app").default.server;
var request = require("supertest").agent(server);
var db = require('../../dist/db/models');
let tokenGenerate = '';

describe("Get User test", done => {

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

    var newPost = {
      title: "whatever title",
      text: "whatever text",
      photo: "whatever photo",
      id_tag: 1,
      id_user: 1
    }

    var newComment = {
      comment: "comment whatever",
      id_post: 1,
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
        return db.posts.create(newPost);
      })
      .then(() => {
        return db.comments.create(newComment);
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

  it("should be a get user with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
          query{
            user(id: 1){
              name
            }
          }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.user.name.should.equal('User');
        done();
      });
  });

  it("should be a get a current user with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
          query{
            currentUser{
              name
            }
          }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.currentUser.name.should.equal('User');
        done();
      });
  });

  it("should not be get user with id wrong", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        query{
          user(id: 2){
            name
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('User not found');
        done();
      });
  });

  it("should get all users enableds", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
          query{
            users{
              name
            }
          }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.users[0].name.should.equal('User');
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
          query{
            user(id: 1){
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

  describe("Fragments from user", () => {
    it("should return posts", done => {
      request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${tokenGenerate}`)
        .send({
          "query": `
          query{
            user(id: 1){
              posts{
                title
              }
            }
          }
          `
        })
        .end((err, res) => {
          res.body.should.be.json;
          res.body.data.user.posts[0].title.should.equal('whatever title');
          done();
        });
    });

    it("should return comments", done => {
      request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${tokenGenerate}`)
        .send({
          "query": `
          query{
            user(id: 1){
              comments {
                comment
              }
            }
          }
          `
        })
        .end((err, res) => {
          res.body.should.be.json;
          res.body.data.user.comments[0].comment.should.equal('comment whatever');
          done();
        });
    });
  });

});