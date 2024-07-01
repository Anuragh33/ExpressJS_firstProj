const express = require('express')
const authController = require('../controllers/authContoller')
const reviewController = require('../controllers/reviewController')

const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictRole('user', 'admin'),
    reviewController.setReview,
    reviewController.createReview
  )

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictRole('user', 'admin'),
    reviewController.deleteReview
  )

module.exports = router
