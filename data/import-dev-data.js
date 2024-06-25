const mongoose = require('mongoose')

const fs = require('fs')

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const Movies = require('../Model/movieModel')

mongoose
  .connect(process.env.CONN_STR, { useNewUrlParser: true })
  .then((conn) => {
    console.log('DB Connection is successful')
  })
  .catch((err) => {
    console.error(err)
  })

const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'))

const deleteMovies = async () => {
  try {
    await Movies.deleteMany()
    console.log('The Previous data is successfully deleted!!')
  } catch (err) {
    console.log(err.message)
  }
  process.exit()
}

const importMovies = async () => {
  try {
    await Movies.create(movies)
    console.log('The data is imported successfully!!')
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
// node data/import-dev-data.js --delete

//To Import
//  node data/import-dev-data.js --import
