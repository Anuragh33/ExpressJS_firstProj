const express = require('express')
const morgan = require('morgan')

const moviesRouter = require('./routes/moviesRouters')

const app = express()
app.use(express.json())
app.use(express.static('./public'))

app.use('/v1/movies/', moviesRouter)
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'Failed',
    message: `Can't find the ${req.originalUrl} in the server.Please try again!`,
  })
  next()
})

module.exports = app
