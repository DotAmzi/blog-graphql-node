require("should");
var Q = require('q');
var server = require("../../dist/app").default.server;
var request = require("supertest").agent(server);
var db = require('../../dist/db/models');
let tokenGenerate = '';

describe("Update Comment test", done => {

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
      id_tag: 1
    }

    var newComment1 = {
      comment: "comment 1",
      id_user: 1,
      id_post: 1
    }

    var newComment2 = {
      comment: "comment 2",
      id_user: 1,
      id_post: 1
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
        return db.comments.create(newComment1);
      })
      .then(() => {
        return db.comments.create(newComment2);
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

  it("should update comment with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updateComment(input: {
            comment: "whatever comment"
          }, id: 1){
            comment
          }
        }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.updateComment.comment.should.equal('whatever comment');
        done();
      });
  });

  it("should update comment with same value", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updateComment(input: {
            comment: "whatever comment"
          }, id: 1){
            comment
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.updateComment.comment.should.equal('whatever comment');
        done();
      });
  });

  it("should not update comment with same value from another comment", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updateComment(input: {
            comment: "comment 2"
          }, id: 1){
            comment
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Comment has been regitred!');
        done();
      });
  });

  it("should not update comment with id wrong", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updateComment(input: {
            comment: "comment 9"
          }, id: 9){
            comment
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Comment with id 9 not exist!');
        done();
      });
  });

  it("should not update comment without token", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": `
        mutation{
          updateComment(input: {
            comment: "comment 2"
          }, id: 1){
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

});