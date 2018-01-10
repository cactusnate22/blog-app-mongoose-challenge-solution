'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { seedDatabase, dropDatabase } = require('./common')

const expect = chai.expect;

//do I have the correct syntax for path to files(models.js, server.js, etc)?
const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
chai.use(chaiHttp);

describe('Blog API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL)
      .then(dropDatabase)
  });

  beforeEach(function() {
    return seedDatabase();
  });

  afterEach(function() {
    return dropDatabase();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {

    it('should return all existing blog posts', function() {
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
      .get('/blog-posts')
      .then(function(_res) {
        res = _res;
        expect(res).to.have.status(200);
        expect(res.body.posts).to.have.length.of.at.least(1);
          return BlogPost.count();
        })
        .then(function(count) {
          expect(res.body.posts).to.have.lengthOf(count);
        });
      });

      it('should return blog posts with correct fields', function() {

        let resBlogPost;
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.posts).to.be.a('array');
          expect(res.body.posts).to.have.length.of.at.least(1);

          res.body.posts.forEach(function(post) {
            expect(post).to.be.a('object');
            expect(post).to.include.keys(
              'id', 'author', 'title', 'content');
          });
          resBlogPost = res.body.posts[0];
          return BlogPost.findById(resBlogPost);
        })
        .then(function(restaurant) {

          expect(resBlogPost.id).to.equal(post.id);
          expect(resBlogPost.author).to.equal(post.author);
          expect(resBlogPost.title).to.equal(post.title);
          expect(resBlogPost.content).to.equal(post.content);
        });
    });
  });

  describe('POST endpoint', function() {
    xit('should add new post', function() {

      const newArticle = generateBlogData();

      return chai.request(app)
        .post('/blog-posts')
        .send(newArticle)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
              'id', 'author', 'title', 'content');
          expect(res.body.author).to.equal(newArticle.author);
            // Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.title).to.equal(newArticle.title);
          expect(res.body.content).to.equal(newArticle.content);
          return BlogPost.findById(res.body.id);
        })
        .then(function(post) {
          expect(post.author).to.equal(newArticle.author);
          expect(post.title).to.equal(newArticle.title);
          expect(post.content).to.equal(newArticle.content);
        });
    });
  });

  describe('PUT endpoint', function() {

    xit('should update the fields in the article that were sent', function () {
      const updatedPost = {
        title: 'Serena and her cat',
        content: 'Once there was a girl named Serena. She had a cat. The end.'
      };
      return BlogPost
        .findOne()
        .then(function(post) {
          updatedPost.id = post.idea;

          return chai.request(app)
            .put(`/blog-post/${blog.id}`)
            .send(updatedPost)
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return BlogPost.findById(updatedPost);
    })
        .then(function(post) {
          expect(post.title).to.equal(updatedPost.title);
          expect(post.content).to.equal(updatedPost.content);
        });
  });
});

describe('DELETE endpoint', function() {

  xit('should delete a post by id', function() {

    let post;

    return BlogPost
      .findOne()
      .then(function(_post) {
        post = _post;
        return chai.request(app).delete(`/blog-posts/${post.id}`);
      })
      .then(function(res) {
          expect(res).to.have.status(204);
          return BlogPost.findById(post.id);
  })
      .then(function(_post) {
        expect(_post).to.be.null;
      });
    });
  });
});
