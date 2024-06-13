const express = require('express')

const {
  getAllMovies,
  getMovieById,
  updateMovieById,
  createMovie,
  deleteMovieById,
  getHighestRated,
  getMovieStats,
  getMoviesByGenre,
} = require('../controllers/moviesController')

const router = express.Router()

router.route('/highest-rated').get(getHighestRated, getAllMovies)

router.route('/stats').get(getMovieStats)

router.route('/genre').get(getMoviesByGenre)

router.route('/').get(getAllMovies).post(createMovie)

router
  .route(`/:id`)
  .get(getMovieById)
  .patch(updateMovieById)
  .delete(deleteMovieById)

module.exports = router
