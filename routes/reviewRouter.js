const express = require('express')
const authController = require('../controllers/authContoller')
const reviewController = require('../controllers/reviewController')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictRole('user', 'admin'),
    reviewController.createReview
  )

module.exports = router
