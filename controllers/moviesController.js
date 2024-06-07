const Movie = require('../Model/movieModel')

const errorMessage = (err, res) => {
  res.status(401).json({
    status: 'Failed',
    message: err.message,
  })
}

exports.getAllMovies = async (req, res) => {
  try {
    const excludeFields = ['sort', 'page', 'limit', 'fileds']

    const queryObj = { ...req.query }

    excludeFields.forEach((el) => delete queryObj[el])

    //Advance Filtering (greater than/ less than/ greater than equal to/ less than equal to)

    let queryStr = JSON.stringify(queryObj)

    const regex = /\b(gte|gt|lte|lt)\b/g

    queryStr = queryStr.replace(regex, (match) => `$${match}`)

    const queryObj1 = JSON.parse(queryStr)

    //Sorting with one or more conditions

    let query = Movie.find(queryObj1)

    const sortBy = req.query.sort.split(',').join(' ')

    req.query.sort ? query.sort(sortBy) : null

    const movies = await query

    const totalMovies = movies.length

    res.status(200).json({
      status: 'Success',
      count: totalMovies,
      data: movies,
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
