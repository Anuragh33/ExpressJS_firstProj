const Review = require('../Model/reviewModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const customError = require('../Utilities/customError')
const factoryFunc = require('./factoryFunction')

exports.createReview = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.movie) req.body.movie = req.params.movieId
  req.body.user = req.user.id

  if (!req.body.review || !req.body.rating) {
    return next(new customError('Rating and Review is needed!!', 400))
  }

  const review = await Review.create(req.body)

  res.status(200).json({
    status: 'Success',
    message: 'The review has been posted successfully!!! ',
    review,
  })
})

exports.getAllReviews = asyncErrorHandler(async (req, res, next) => {
  let filter = {}

  if (req.params.movieId) filter = { movie: req.params.movieId }

  const reviews = await Review.find(filter)

  res.status(200).json({
    status: 'Success',
    count: reviews.length,
    data: {
      reviews,
    },
  })
})


exports.