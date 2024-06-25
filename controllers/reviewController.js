const Review = require('../Model/reviewModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const customError = require('../Utilities/customError')

exports.createReview = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.review || !req.body.rating) {
    return next(new customError('Rating and Review is needed!!', 400))
  }

  const review = await Review.create(req.body)

  res.status(200).json({
    status: 'Success',
    message: 'The review has been posted successfully!!! ',
  })
})

exports.getAllReviews = asyncErrorHandler(async (req, res, next) => {
  const reviews = await Review.find()

  res.status(200).json({
    status: 'Success',
    count: reviews.length,
    data: {
      reviews,
    },
  })
})
