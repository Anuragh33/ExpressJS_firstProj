const express = require('express')
const fs = require('fs')
const path = require('path')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const sanatize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')

const moviesRouter = require('./routes/moviesRouters')
const customError = require('./Utilities/customError')
const errorController = require('./controllers/errorController')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const reviewRouter = require('./routes/reviewRouter')
const viewRouter = require('./routes/viewRouter')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

let limiter = rateLimiter({
  max: 100,
  WindowMs: 60 * 60 * 1000,
  message:
    'We have received too many requests from this IP. Please try after sometime!!',
})

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['http://127.0.0.1:3000/*'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'self'",
          'https://*.stripe.com',
          'https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js',
        ],
        frameSrc: ["'self'", 'https://*.stripe.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        upgradeInsecureRequests: [],
      },
    },
  })
)

app.use('/v1', limiter)
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

app.use(
  express.json({
    limit: '10kb',
  })
)

app.use(sanatize())
app.use(xss())
app.use(
  hpp({
    whitelist: [
      'duration',
      'genres',
      'ratings',
      'releaseYear',
      'directors',
      'actors',
    ],
  })
)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  req.requestTime = new Date().toUTCString()
  const data = `Anuragh requested ${res} on ${req}at ${req.requestTime} `
  fs.writeFileSync('./Log/log.txt', data)
  //console.log(res)
  next()
})

app.use('/', viewRouter)
app.use('/v1/movies', moviesRouter)
app.use('/v1/auth', authRouter)
app.use('/v1/users', userRouter)
app.use('/v1/reviews', reviewRouter)

app.all('*', (req, res, next) => {
  const err = new customError(
    `Can't find the ${req.originalUrl} in the server. Please try again!`,
    404
  )
  next(err)
})

app.use(errorController)

module.exports = app
