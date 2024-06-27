const Apifeatures = require('../Utilities/APIFeatures')
const Movie = require('../Model/movieModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const customError = require('../Utilities/customError')
const factoryFunc = require('./factoryFunction')

exports.getHighestRated = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratings'
  req.query.fields = '-createdAt -coverImage -__v -releaseDate'
  next()
}

exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {
  const features = new Apifeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination()

  let movies = await features.query

  res.status(200).json({
    status: 'Success',
    length: movies.length,
    data: {
      movies,
    },
  })
})

exports.createMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.create(req.body)

  //
  res.status(200).json({
    status: 'Success',
    data: {
      movie,
    },
  })
})

exports.getMovieById = asyncErrorHandler(async (req, res, next) => {
  const movieByID = await Movie.findById(req.params.id).populate('reviews')

  if (!movieByID) {
    return next(new customError('Movie with that ID is not found!!', 404))
  }

  res.status(200).json({
    status: 'Success',
    data: {
      movieByID,
    },
  })
})

exports.updateMovieById = asyncErrorHandler(async (req, res, next) => {
  const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!updateMovie) {
    return next(new customError('Movie with that ID is not found', 404))
  }

  res.status(200).json({
    status: 'Success',
    data: {
      updateMovie,
    },
  })
})

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
