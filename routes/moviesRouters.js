const express = require('express')
const router = express.Router()

const movieController = require('../controllers/moviesController')

const authController = require('../controllers/authContoller')
const reviewRouter = require('../routes/reviewRouter')

router.use('/:movieId/reviews', reviewRouter)

router
  .route('/highest-rated')
  .get(movieController.getHighestRated, movieController.getAllMovies)

router.route('/stats').get(movieController.getMovieStats)

router.route('/genre/:genre').get(movieController.getMoviesByGenre)

router
  .route('/')
  .get(authController.protect, movieController.getAllMovies)
  .post(authController.protect, movieController.createMovie)

router
  .route(`/:id`)
  .get(authController.protect, movieController.getMovieById)
  .patch(authController.protect, movieController.updateMovieById)
  .delete(
    authController.protect,
    authController.restrictRole('admin'),
    movieController.deleteMovieById
  )

// router
//   .route('/:movieId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictRole('user'),
//     reviewController.createReview
//   )

module.exports = router
