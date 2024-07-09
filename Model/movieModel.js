const mongoose = require('mongoose')
const fs = require('fs')
const validator = require('validator')
const User = require('./userModel')
const slugify = require('slugify')

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required field!!'],
      unique: true,
      maxlength: [40, 'A Name should have a maximum of {MAXLENGTH} characters'],
      minlength: [5, `A Name should have a minimum of {MINLENGTH} characters`],
      trim: true,
      //validate: [validator.isAlpha, 'Name should only contain alphabets'],
    },
    description: {
      type: String,
      required: [true, 'Description is required field!!'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required field!!'],
    },
    ratings: {
      type: Number,
      set: (val) => Math.round(val * 10) / 10,
      validate: {
        validator: function (value) {
          return value >= 1 && value < 10
        },
        message:
          'The rating must be between 1 and 10. The rating you have given is {VALUE}',
      },
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release Year is required field!!'],
    },
    releaseDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    genres: {
      type: [String],
      required: [true, 'Genres is required field!!'],
    },
    directors: {
      type: [String],
      required: [true, 'Directors is required field!!'],
    },
    coverImage: {
      type: String,
      required: [true, 'Image is required field!!'],
    },
    actors: {
      type: [String],
      required: [true, 'Actors is required field!!'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required field!!'],
    },
    createdBy: {
      type: String,
    },
    slug: { type: String },
    theaterLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    otherLocations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    authorisedUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
)

// movieSchema.pre('save', async function (next) {
//   const authUsersPromises = this.authorisedUsers.map(
//     async (id) => await User.findById(id)
//   )
//   this.authorisedUsers = await Promise.all(authUsersPromises)
//   next()
// })

movieSchema.index({ price: 1, ratings: 1 }, { unique: true })
movieSchema.index({ slug: 1 })
movieSchema.index({ theaterLocation: '2dsphere' })

movieSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'movie',
  localField: '_id',
})

movieSchema.virtual('durationInHours').get(function () {
  return `${(this.duration / 60).toFixed(1)} Hrs`
})

movieSchema.pre('save', function (next) {
  this.createdBy = 'Anuragh'
  next()
})

movieSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'authorisedUsers',
    select: '-__v',
  })
  next()
})

movieSchema.post('save', function (doc, next) {
  const date = new Date()
  const content = `A new movie ${doc.name} is created by ${
    doc.createdBy
  } successfully on ${date.toUTCString()} \n`

  fs.writeFileSync('./Log/log.txt', content, { flag: 'a' }, (err) =>
    console.log(err.message)
  )
  next()
})

movieSchema.pre(/^find/, function (next) {
  //this.find({ releaseDate: { $gte: Date.now() } })
  next()
})

// movieSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } })
//   next()
// })

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie
