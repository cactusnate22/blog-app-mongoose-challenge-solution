const faker = require('faker')
const mongoose = require('mongoose')

const { BlogPost } = require('../models')

function seedDatabase () {
  const blogPosts = []

  for (let i = 1; i <= 10; i++) {
    blogPosts.push(createFakeArticle())
  }

  return BlogPost.insertMany(blogPosts)
}

function dropDatabase () {
  return mongoose.connection.dropDatabase()
}

function createFakeArticle () {
  return {
    author: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    },
    title: faker.lorem.words(),
    content: faker.lorem.paragraph()
  };
}

module.exports = { seedDatabase, dropDatabase, createFakeArticle }
