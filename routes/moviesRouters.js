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

router.use(authController.protect)

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(movieController.createMovie)

router
  .route(`/:id`)
  .get(movieController.getMovieById)
  .patch(movieController.updateMovieById)
  .delete(authController.restrictRole('admin'), movieController.deleteMovieById)

module.exports = router
