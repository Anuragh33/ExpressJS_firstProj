const express = require('express')
const app = express()
const morgan = require('morgan')
const moviesRouter = require('./routes/moviesRouters')

const logger = function (req, res, next) {
  console.log('The custom middleware is called.....')
  next()
}

app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('./public'))
app.use(logger)
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString()
  next()
})

app.use('/v1/movies/', moviesRouter)

module.exports = app
