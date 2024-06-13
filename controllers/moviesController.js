const Apifeatures = require('../Utilities/APIFeatures')
const Movie = require('../Model/movieModel')

const errorMessage = (err, res) => {
  res.status(401).json({
    status: 'Failed',
    message: err.message,
  })
}

exports.getHighestRated = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratings'
  req.query.fields = '-createdAt -coverImage -__v -releaseDate'
  next()
}

exports.getAllMovies = async (req, res) => {
  try {
    const features = new Apifeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination()

    let movies = await features.query

    // const excludeFields = ['sort', 'page', 'limit', 'fields']
    // const queryObj = { ...req.query }
    // excludeFields.forEach((el) => delete queryObj[el])

    // //Advance Filtering (greater than/ less than/ greater than equal to/ less than equal to)

    // let queryStr = JSON.stringify(queryObj)

    // const regex = /\b(gte|gt|lte|lt)\b/g

    // queryStr = queryStr.replace(regex, (match) => `$${match}`)

    // const queryObj1 = JSON.parse(queryStr)

    // let query = Movie.find(queryObj1)

    // //Sorting with one or more conditions

    // req.query.sort
    //   ? query.sort(req.query.sort.split(',').join(' '))
    //   : query.sort('-name')

    // //Limiting Fields

    // req.query.fields
    //   ? query.select(req.query.fields.split(',').join(' '))
    //   : query.select('-__v')

    // //Pagination

    // const page = +req.query.page || 1
    // const limit = +req.query.limit || 5
    // const skip = (page - 1) * limit
    // query = query.skip(skip).limit(limit)

    // if (req.query.page) {
    //   const moviesCount = await Movie.countDocuments()
    //   if (skip >= moviesCount)
    //     throw new Error(' There are no records to display!!')
    // }

    // const movies = await query

    const totalMovies = res.status(200).json({
      status: 'Success',
      length: movies.length,
      data: {
        movies,
      },
    })
  } catch (err) {
    errorMessage(err, res)
  }
}

exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body)

    res.status(200).json({
      status: 'Success',

      data: {
        movie,
      },
    })
  } catch (err) {
    errorMessage(err, res)
  }
}

exports.getMovieById = async (req, res) => {
  try {
    const movieByID = await Movie.findById(req.params.id)

    res.status(200).json({
      status: 'Success',
      data: movieByID,
    })
  } catch (err) {
    errorMessage(err, res)
  }
}

exports.updateMovieById = async (req, res) => {
  try {
    const updatemovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'Success',
      data: updatemovie,
    })
  } catch (err) {
    errorMessage(err, res)
  }
}

exports.deleteMovieById = async (req, res) => {
  try {
    const deleteMovie = await Movie.findByIdAndDelete(req.params.id)

    res.status(200).json({
      status: 'Success',
      message: 'The movie is deleted',
      data: deleteMovie,
    })
  } catch (err) {
    errorMessage(err, res)
  }
}

exports.getMovieStats = async (req, res) => {
  try {
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
  } catch (err) {
    errorMessage(err, res)
  }
}

exports.getMoviesByGenre = async (req, res) => {
  try {
    const genre = req.params.genre

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
      { $match: { genre: genre } },
    ])

    res.status(200).json({
      status: 'Success',
      length: moviesByGenre.length,
      data: {
        moviesByGenre,
      },
    })
  } catch (err) {
    errorMessage(err, res)
  }
}
