const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!!'],
    },
    rating: {
      type: Number,
      default: 1,
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

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'movie',
    select: '-_id name',
  }).populate({
    path: 'user',
    select: 'name role',
  })
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
