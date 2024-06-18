// const customError = require('../Utilities/customError')

// const devErrors = (res, err) => {
//   res.status(err.statusCode).json({
//     status: err.statusCode,
//     message: err.message,
//     stackTrace: err.stack,
//     error: err,
//   })
// }

// const prodErrors = (res, err) => {
//   err.isOperational
//     ? res.status(err.statusCode).json({
//         status: err.statusCode,
//         message: err.message,
//       })
//     : res.status(500).jsob({
//         status: 'Error',
//         message: 'Someting is wrong!! Please try again.',
//       })
// }

// const castErrorHandler = (err) => {
//   const message = `Invalid value to the path ${err.path}:  ${err.value}!`
//   return new customError(message, 400)
// }

// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500
//   err.status = err.status || 'Error'

//   if (process.env.NODE_ENV === 'development') {
//     devErrors(res, err)
//   } else if (process.env.NODE_ENV === 'production') {
//     err.name === 'CastError' ? (err = castErrorHandler()) : null

//     prodErrors(res, err)
//   }
// }

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'Error'

  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    stackTrace: err.stack,
    //error: err,
  })
  next()
}
