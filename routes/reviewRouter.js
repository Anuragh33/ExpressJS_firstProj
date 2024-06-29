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
    reviewController.setReview,
    reviewController.createReview
  )

router
  .route('/:id')
  .get(authController.protect, reviewController.getReview)
  .delete(authController.protect, reviewController.deleteReview)

module.exports = router
