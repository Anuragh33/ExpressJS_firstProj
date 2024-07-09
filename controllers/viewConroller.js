const Movie = require('../Model/movieModel')
const User = require('../Model/userModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const customError = require('../Utilities/customError')

let policy = (res) => {
  return res.set(
    'Content-Security-Policy',
    "connect-src 'self';font-src fonts.gstatic.com;style-src 'self' 'unsafe-inline' fonts.googleapis.com"
  )
}

exports.getMovie = asyncErrorHandler(async (req, res, next) => {
  policy(res)

  const movie = await Movie.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  })

  if (!movie) {
    return next(new customError('Invalid movie name. Try Again!!', 404))
  }

  res.status(200).render('movie', {
    movie,
  })
})

exports.getOverview = asyncErrorHandler(async (req, res, next) => {
  policy(res)

  const movies = await Movie.find()

  res.status(200).render('overview', {
    title: 'All Movies',
    movies,
  })
})

exports.login = asyncErrorHandler(async (req, res) => {
  policy(res)

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('login', {
      title: 'Login to you account!!',
    })
})

exports.getMe = (req, res, next) => {
  policy(res)
  res.status(200).render('account', {
    title: 'Your Account',
  })
}

exports.updateUserData = asyncErrorHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser,
  })
})
