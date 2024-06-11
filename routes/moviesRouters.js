const express = require('express')

const {
  getAllMovies,
  getMovieById,
  updateMovieById,
  createMovie,
  deleteMovieById,
  getHighestRated,
} = require('../controllers/moviesController')

const router = express.Router()

router.route('/highest-rated').get(getHighestRated, getAllMovies)

router.route('/').get(getAllMovies).post(createMovie)

router
  .route(`/:id`)
  .get(getMovieById)
  .patch(updateMovieById)
  .delete(deleteMovieById)

module.exports = router
