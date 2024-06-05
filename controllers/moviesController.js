const fs = require('fs')

const Movie = require('../Model/movieModel')

const movies = JSON.parse(fs.readFileSync('./data/movies.json'))

// const movieExistChecker = (id) => {
//   const movieToCheck = movies.find((el) => el.id === id)

//   if (!movieToCheck)
//     res.status(404).json({
//       status: 'fail',
//       message: `movie with id ${id} can't be found`,
//     })

//   return movieToCheck
// }

exports.checkId = (req, res, next, value) => {
  const movie = movies.find((el) => el.id === value * 1)

  if (!movie)
    res.status(404).json({
      status: 'fail',
      message: `movie with id ${value} can't be found`,
    })

  next()
}

exports.validateBody = (req, res, next) => {
  if (!req.body.name || !req.body.releaseYear)
    return res.status(404).json({
      status: 'fail',
      message: 'not a valid data',
    })

  next()
}

exports.getAllMovies = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedAt,
    data: {
      count: movies.length,
      movies: movies,
    },
  })
}

exports.createMovie = (req, res) => {
  const newId = movies[movies.length - 1].id + 1

  const newMovie = Object.assign({ id: newId }, req.body)
  movies.push(newMovie)
  fs.writeFile('./data/movies.json', JSON.stringify(movies), (err, data) => {
    res.status(200).json({
      status: 'success',
      data: {
        movies: newMovie,
      },
    })
  })
  res.send('data is added!!')
}

exports.getMovieById = (req, res) => {
  const id = req.params.id * 1
  const movieById = movies.find((el) => el.id === id)

  res.status(200).json({
    status: 'success',
    data: {
      movie: movieById,
    },
  })
}

exports.updateMovieById = (req, res) => {
  const id = +req.params.id

  const movieToUpdate = movies.find((el) => el.id === id)

  const index = movies.indexOf(movieToUpdate)
  Object.assign(movieToUpdate, req.body)
  movies[index] = movieToUpdate

  fs.writeFile('./data/movies.json', JSON.stringify(movies), (err, data) => {
    res.status(200).json({
      status: 'success',
      data: {
        movie: movieToUpdate,
      },
    })
  })
}

exports.deleteMovieById = (req, res) => {
  const id = +req.params.id
  const movieToDelete = movies.find((el) => el.id === id)

  const index = movies.indexOf(movieToDelete)
  movies.splice(index, 1)

  fs.writeFile('./data/movies.json', JSON.stringify(movies), (err, data) => {
    res.status(200).send(`movie with the id ${id} is deleted.`)
  })
}
