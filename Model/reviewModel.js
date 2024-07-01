const mongoose = require('mongoose')
const Movie = require('./movieModel')

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!!'],
    },
    rating: {
      type: Number,

      max: 10,
      min: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    movie: {
      type: mongoose.Schema.ObjectId,
      ref: 'Movie',
      required: [true, 'A Review must be given to a movie!!'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Review must be attached to a user !!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name role',
  })
  next()
})

reviewSchema.statics.calAverageRating = async function (movieId) {
  const stats = await this.aggregate([
    {
      $match: { movie: movieId },
    },
    {
      $group: {
        _id: '$movie',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])

  if (stats.length > 0) {
    await Movie.findByIdAndUpdate(movieId, {
      totalRatings: stats[0].nRating,
      ratings: stats[0].avgRating,
    })
  } else {
    await Movie.findByIdAndUpdate(movieId, {
      totalRatings: 0,
      averageRatings: 3,
    })
  }
}

reviewSchema.post('save', function () {
  this.constructor.calAverageRating(this.movie)
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne()

  next()
})

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calAverageRating(this.r.movie)
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
