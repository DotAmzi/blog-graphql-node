require("should");
var Q = require('q');
var server = require("../../dist/app").default.server;
var request = require("supertest").agent(server);
var db = require('../../dist/db/models');
let tokenGenerate = '';

describe("Update Post test", done => {

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

    var newPost1 = {
      title: "whatever title",
      text: "whatever text",
      photo: "whatever photo",
      id_tag: 1
    }

    var newPost2 = {
      title: "whatever title 2",
      text: "whatever text",
      photo: "whatever photo",
      id_tag: 1
    }

    db.sequelize.sync({force: true})
      .then(()=> {
        return db.users.create(newUser);
      })
      .then(() => {
        return db.tags.create(newTag1);
      })
      .then(() => {
        return db.posts.create(newPost1);
      })
      .then(() => {
        return db.posts.create(newPost2);
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

  it("should update post with success", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updatePost(input: {
            title: "another title"
          }, id: 1){
            title
          }
        }
        `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.updatePost.title.should.equal('another title');
        done();
      });
  });

  it("should update post title with same value", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updatePost(input: {
            title: "another title"
          }, id: 1){
            title
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.data.updatePost.title.should.equal('another title');
        done();
      });
  });

  it("should not update post name with same value from another post", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updatePost(input: {
            title: "whatever title 2"
          }, id: 1){
            title
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Title registred on another post!');
        done();
      });
  });

  it("should not update post name with id tag wrong", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updatePost(input: {
            id_tag: 2
          }, id: 1){
            title
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Tag with id 2 has not been created!');
        done();
      });
  });

  it("should not update post name with id wrong", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${tokenGenerate}`)
      .send({
        "query": `
        mutation{
          updatePost(input: {
            title: "whatever title"
          }, id: 9){
            title
          }
        }
      `
      })
      .end((err, res) => {
        res.body.should.be.json;
        res.body.errors[0].message.should.equal('Post with id 9 not exist!');
        done();
      });
  });

  it("should not update post without token", done => {
    request
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        "query": `
        mutation{
          updatePost(input: {
            title: "whatever title 2"
          }, id: 1){
            title
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