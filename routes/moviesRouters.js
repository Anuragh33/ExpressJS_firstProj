const express = require('express')

const {
  getAllMovies,
  getMovieById,
  updateMovieById,
  createMovie,
  deleteMovieById,
  checkId,
  validateBody,
} = require('../controllers/moviesController')

const router = express.Router()

router.route('/').get(getAllMovies).post(createMovie)

router
  .route(`/:id`)
  .get(getMovieById)
  .patch(updateMovieById)
  .delete(deleteMovieById)

module.exports = router
