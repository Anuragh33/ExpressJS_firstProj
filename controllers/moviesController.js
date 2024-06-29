const Movie = require('../Model/movieModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const factoryFunc = require('./factoryFunction')

exports.getHighestRated = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratings'
  req.query.fields = '-createdAt -coverImage -__v -releaseDate'
  next()
}

exports.getAllMovies = factoryFunc.getAll(Movie)

exports.getMovieById = factoryFunc.getOne(Movie, {
  path: 'reviews',
})

exports.createMovie = factoryFunc.createOne(Movie)

exports.updateMovieById = factoryFunc.updateOne(Movie)

exports.deleteMovieById = factoryFunc.deleteOne(Movie)

exports.getMovieStats = asyncErrorHandler(async (req, res, next) => {
  const stats = await Movie.aggregate([
    { $match: { ratings: { $gte: 4.5 } } },
    {
      $group: {
        _id: '$releaseYear',
        avgRating: { $avg: '$ratings' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $min: '$price' },
        minPrice: { $max: '$price' },
        priceTotal: { $sum: '$price' },
        movieCount: { $sum: 1 },
      },
    },
    { $sort: { minPrice: 1 } },
  ])

  res.status(200).json({
    status: 'Success',
    length: stats.length,
    data: {
      stats,
    },
  })
})

exports.getMoviesByGenre = asyncErrorHandler(async (req, res, next) => {
  const genreP = req.params.genre

  const moviesByGenre = await Movie.aggregate([
    { $unwind: '$genres' },
    {
      $group: {
        _id: '$genres',
        movieCount: { $sum: 1 },
        movies: { $push: '$name' },
      },
    },

    { $addFields: { genre: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { movieCount: -1 } },
    { $match: { genre: genreP } },
  ])

  res.status(200).json({
    status: 'Success',
    length: moviesByGenre.length,
    data: {
      moviesByGenre,
    },
  })
})
