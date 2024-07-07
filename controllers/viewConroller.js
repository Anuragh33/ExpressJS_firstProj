const Movie = require('../Model/movieModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')

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
