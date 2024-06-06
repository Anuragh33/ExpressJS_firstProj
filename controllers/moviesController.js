const Movie = require('../Model/movieModel')

const errorMessage = (err, res) => {
  res.status(401).json({
    status: 'Failed',
    message: err.message,
  })
}

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
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
