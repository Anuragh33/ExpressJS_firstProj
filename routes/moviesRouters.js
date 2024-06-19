const express = require('express')
const router = express.Router()

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

const authController = require('../controllers/authContoller')

router.route('/highest-rated').get(getHighestRated, getAllMovies)

router.route('/stats').get(getMovieStats)

router.route('/genre/:genre').get(getMoviesByGenre)

router
  .route('/')
  .get(authController.protect, getAllMovies)
  .post(authController.protect, createMovie)

router
  .route(`/:id`)
  .get(authController.protect, getMovieById)
  .patch(authController.protect, updateMovieById)
  .delete(authController.protect, deleteMovieById)

module.exports = router
