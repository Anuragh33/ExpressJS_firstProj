const customError = require('../Utilities/customError')

const devErrors = (res, err) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    stackTrace: err.stack,
    error: err,
  })
}

const prodErrors = (res, err) => {
  err.isOperational
    ? res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
      })
    : res.status(500).jsob({
        status: 'Error',
        message: 'Someting is wrong!! Please try again.',
      })
}

const castErrorHandler = (err) => {
  const message = `Invalid value to path ${err.path}: ${err.value}!`
  //console.log(err)

  return new customError(message, 400)
}

const duplicateKeyErrorHandler = (err) => {
  const message = `The entered value ${err.keyValue.name} already exist!!`
  //console.log(err)
  return new customError(message, 400)
}

const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message)
  const message = errors.join(',')
  return new customError(message, 400)
}

const tokenExpiredError = (err) => {
  const message = `${err.name}: Please sign-in again!!`
  return new customError(message, 401)
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'Error'

  if (process.env.NODE_ENV === 'development') {
    devErrors(res, err)
  } else if (process.env.NODE_ENV === 'production') {
    //let error = Object.create(err)
    err.name === 'CastError' ? (err = castErrorHandler(err)) : null
    err.code = 11000 ? (err = duplicateKeyErrorHandler(err)) : null
    err.name === 'ValidationError' ? (err = validationErrorHandler(err)) : null

    err.name === 'TokenExpiredError' ? (err = tokenExpiredError(err)) : null

    prodErrors(res, err)
  }
}

//production mode
//export NODE_ENV=production

//developer mode
//export NODE_ENV=developer
