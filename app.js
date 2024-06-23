const express = require('express')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')

const moviesRouter = require('./routes/moviesRouters')
const customError = require('./Utilities/customError')
const errorController = require('./controllers/errorController')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')

const app = express()

app.use(helmet())

let limiter = rateLimiter({
  max: 100,
  WindowMs: 60 * 60 * 1000,
  message:
    'We have received too many requests from this IP. Please try after sometime!!',
})

app.use('/v1', limiter)

app.use(
  express.json({
    limit: '10kb',
  })
)
app.use(express.static('./public'))

app.use('/v1/movies', moviesRouter)
app.use('/v1/auth', authRouter)
app.use('/v1/users', userRouter)

app.all('*', (req, res, next) => {
  const err = new customError(
    `Can't find the ${req.originalUrl} in the server. Please try again!`,
    404
  )
  next(err)
})

app.use(errorController)

module.exports = app
