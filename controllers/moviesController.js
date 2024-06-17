const Apifeatures = require('../Utilities/APIFeatures')
const Movie = require('../Model/movieModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')

exports.getHighestRated = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratings'
  req.query.fields = '-createdAt -coverImage -__v -releaseDate'
  next()
}

exports.getAllMovies = asyncErrorHandler(async (req, res) => {
  const features = new Apifeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination()

  let movies = await features.query

  const totalMovies = res.status(200).json({
    status: 'Success',
    length: movies.length,
    data: {
      movies,
    },
  })
})

exports.createMovie = asyncErrorHandler(async (req, res) => {
  const movie = await Movie.create(req.body)

  res.status(200).json({
    status: 'Success',

    data: {
      movie,
    },
  })
})

exports.getMovieById = asyncErrorHandler(async (req, res) => {
  const movieByID = await Movie.findById(req.params.id)

  res.status(200).json({
    status: 'Success',
    data: movieByID,
  })
})

exports.updateMovieById = asyncErrorHandler(async (req, res) => {
  const updatemovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'Success',
    data: updatemovie,
  })
})

exports.deleteMovieById = asyncErrorHandler(async (req, res) => {
  const deleteMovie = await Movie.findByIdAndDelete(req.params.id)

  res.status(200).json({
    status: 'Success',
    message: 'The movie is deleted',
    data: deleteMovie,
  })
})

exports.getMovieStats = asyncErrorHandler(async (req, res) => {
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

exports.getMoviesByGenre = asyncErrorHandler(async (req, res) => {
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
