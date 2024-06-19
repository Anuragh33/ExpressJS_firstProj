const express = require('express')
const morgan = require('morgan')
const moviesRouter = require('./routes/moviesRouters')
const customError = require('./Utilities/customError')
const errorController = require('./controllers/errorController')
const authRouter = require('./routes/authRouter')

const app = express()
app.use(express.json())
app.use(express.static('./public'))

app.use('/v1/movies/', moviesRouter)
app.use('/v1/users', authRouter)

app.all('*', (req, res, next) => {
  const err = new customError(
    `Can't find the ${req.originalUrl} in the server. Please try again!`,
    404
  )
  next(err)
})

app.use(errorController)

module.exports = app
