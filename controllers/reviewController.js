const Review = require('../Model/reviewModel')
stomError = require('../Utilities/customError')
const factoryFunc = require('./factoryFunction')

exports.setReview = (req, res, next) => {
  if (!req.body.movie) req.body.movie = req.params.movieId
  req.body.user = req.user.id

  if (!req.body.review || !req.body.rating) {
    return next(new customError('Rating and Review is needed!!', 400))
  }
  next()
}

exports.getAllReviews = factoryFunc.getAll(Review)

exports.getReview = factoryFunc.getOne(Review)

exports.createReview = factoryFunc.createOne(Review)

exports.updateReview = factoryFunc.updateOne(Review)

exports.deleteReview = factoryFunc.deleteOne(Review)
