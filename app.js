const express = require('express')
const rateLimiter = require('express-rate-limit')

const moviesRouter = require('./routes/moviesRouters')
const customError = require('./Utilities/customError')
const errorController = require('./controllers/errorController')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')

const app = express()

let limiter = rateLimiter({
  max: 1000,
  WindowMs: 3600 * 1000,
  message:
    'We have received too many requests from this IP. Please try after sometime!!',
})

app.use('/api', limiter)

app.use(express.json())
app.use(express.static('./public'))

app.use('/v1/movies/', moviesRouter)
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
