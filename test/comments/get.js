require("should");
var Q = require('q');
var server = require("../../dist/app").default.server;
var request = require("supertest").agent(server);
var db = require('../../dist/db/models');
let tokenGenerate = '';

describe("Get Comment test", done => {

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

  it("should get a comment with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        query{
          comment(id: 1){
            id
            comment
          }
        }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.comment.comment.should.equal('comment whatever');
        done();
      });
  });

  it("should not get comment with id wrong", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        query{
          comment(id: 2){
            id
            comment
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Comment not found');
        done();
      });
  });

  it("should get all comment with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        query{
          comments{
            comment
          }
        }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.comments[0].comment.should.equal('comment whatever');
        done();
      });
  });

  it("should not get post without token", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": `
        query{
          comments{
            id
            comment
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

  describe("fragments from comments", done => {
    it("should get user from comment", done => {
      request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${tokenGenerate}`)
        .send({
          "query": `
          query{
            comment(id: 1){
              user{
                name
              }
            }
          }
          `
        })
        .end((err, res) => {
          res.body.should.be.json;
          res.body.data.comment.user.name.should.equal('User');
          done();
        });
    });

    it("should get user from comment", done => {
      request
        .post('/graphql')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${tokenGenerate}`)
        .send({
          "query": `
          query{
            comment(id: 1){
              post{
                title
              }
            }
          }
          `
        })
        .end((err, res) => {
          res.body.should.be.json;
          res.body.data.comment.post.title.should.equal('whatever title');
          done();
        });
    });
  });

});