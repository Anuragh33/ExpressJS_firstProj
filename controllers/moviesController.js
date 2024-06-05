const Movie = require('../Model/movieModel')

exports.validateBody = (req, res, next) => {
  if (!req.body.name || !req.body.releaseYear)
    return res.status(404).json({
      status: 'fail',
      message: 'not a valid data',
    })

  next()
}

exports.getAllMovies = (req, res) => {}

exports.createMovie = (req, res) => {}

exports.getMovieById = (req, res) => {}

exports.updateMovieById = (req, res) => {}

exports.deleteMovieById = (req, res) => {}
