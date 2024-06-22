const User = require('../Model/userModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const customError = require('../Utilities/customError')
const email = require('../Utilities/email')
const crypto = require('crypto')

const signToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.SECRET_STR,
    {
      expiresIn: process.env.LOGIN_EXPIRES,
    }
  )
}

const resCookie = (res, token) => {
  const options = {
    maxAge: process.env.LOGIN_EXPIRES,
    httpOnly: true,
  }

  if (process.env.NODE_env === 'production') {
    options.secure = true
  }

  res.cookie('jwt', token, options)
}

exports.signUp = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body)

  const { name, email, _id } = newUser

  const token = signToken(name, email, _id)

  resCookie(res, token)

  res.status(201).json({
    status: 'Success',
    token,
    message: 'The User is created!!',
    data: {
      user: newUser,
    },
  })
})

exports.login = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    const err = new customError('Email or Password is missing!!', 400)
    return next(err)
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    const err = new customError(
      'The user does not exist. Please signup first!!',
      400
    )
    return next(err)
  }

  const isMatched = await user.comparePasswordDB(password, user.password)

  if (!isMatched) {
    const err = new customError(
      'The password you have entered is wrong. Please enter a correct password!!',
      400
    )
    return next(err)
  }

  const token = signToken(user.name, user.email, user._id)

  res.status(200).json({
    status: 'Success',
    message: 'The User logged in successfully!!',
    userLogged: `The logged in user is ${user.email} with an id ${user._id}`,
    token,
  })
})

///////////////////////////////////////////////////////

exports.protect = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization

  if (!testToken) {
    const err = new customError('Please login to proceed!!', 400)
    return next(err)
  }

  let token

  if (testToken && testToken.startsWith('Bearer')) {
    token = testToken.split(' ')[1]
  }

  if (!token) {
    const err = new customError('No Access!! login in first.', 401)
    return next(err)
  }

  const decodedToken = jwt.verify(token, process.env.SECRET_STR)

  const user = await User.findById(decodedToken.id)

  //console.log(user)

  if (!user) {
    const err = new customError(
      'The user does not exist within the given token. Please contact the administrator.',
      401
    )
    return next(err)
  }

  const isPwdChanged = await user.isPasswordChanged(decodedToken.iat)

  if (isPwdChanged) {
    const err = new customError(
      'The password is changed recently. Please login again.',
      401
    )
    return next(err)
  }

  req.user = user
  next()
})

exports.restrictRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const err = new customError(
        'You do not have necessary privilages to perform this action!! ',
        403
      )
      return next(err)
    }
    next()
  }
}

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    const err = new customError(
      `The user with the email ${req.body.email} does not exist`,
      404
    )
    return next(err)
  }

  const resetToken = user.generateResetToken()

  await user.save({ validateBeforeSave: false })

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/v1/auth/passwordreset/${resetToken}`

  const message = `We have recieved a request for password reset. Please click the link below to reset your pasword. \n\n${resetURL}\n\n The link will be expired within 10 minutes.`

  try {
    await email({
      email: user.email,
      subject: 'Request for Password Change',
      message: message,
    })

    res.status(200).json({
      status: 'Success',
      message: 'Password reset mail was sent to the user.',
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetTokenExpire = undefined
    user.save({ validateBeforeSave: false })

    return next(
      new customError('There was an error while sending the mail', 500)
    )
  }
})

exports.passwordReset = asyncErrorHandler(async (req, res, next) => {
  const token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpire: { $gt: Date.now() },
  })

  if (!user) {
    const err = new customError(
      'The password reset token wasinvalid or  expired. Please try again!!',
      400
    )
    return next(err)
  }

  user.password = req.body.password
  user.confirmPassword = req.body.confirmPassword
  user.passwordResetToken = undefined
  user.passwordResetTokenExpire = undefined

  user.passwordChangedAt = Date.now()

  user.save()

  const loginToken = signToken(user.name, user.email, user._id)

  res.status(200).json({
    status: 'Success',
    message: 'Password has been reset successfully!!',
    userLogged: `The logged in user is ${user.email} with an id ${user._id}`,
    loginToken,
  })
})
