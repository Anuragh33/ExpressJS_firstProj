const mongoose = require('mongoose')

const fs = require('fs')

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const Movies = require('../Model/movieModel')
const User = require('../Model/userModel')
const Review = require('../Model/reviewModel')

mongoose
  .connect(process.env.CONN_STR, { useNewUrlParser: true })
  .then((conn) => {
    console.log('DB Connection is successful')
  })
  .catch((err) => {
    console.error(err)
  })

const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'))
const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))
const reviews = JSON.parse(fs.readFileSync('./data/reviews.json', 'utf-8'))

const deleteMovies = async () => {
  try {
    await Movies.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log('Previous data deleted successfully!!')
  } catch (err) {
    console.log(err.message)
  }
  process.exit()
}

const importMovies = async () => {
  try {
    await Movies.create(movies)
    await User.create(users, { validateBeforeSave: false })
    await Review.create(reviews, { validateBeforeSave: false })
    console.log('Data loaded successfully!!')
  } catch (err) {
    console.log(err)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importMovies()
} else if (process.argv[2] === '--delete') {
  deleteMovies()
}

//To Delete
//   node data/import-dev-data.js --delete

//To Import

//Comment out the middle wear in the userModel.js and reviewModel.js before importing

//  node data/import-dev-data.js --import
