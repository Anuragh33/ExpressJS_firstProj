const express = require('express')
const authController = require('../controllers/authContoller')
const reviewController = require('../controllers/reviewController')

const router = express.Router()

router
  .route('/createreview')
  .post(authController.protect, reviewController.createReview)

router
  .route('/reviews')
  .get(
    authController.protect,
    authController.restrictRole('admin'),
    reviewController.getAllReviews
  )

module.exports = router
