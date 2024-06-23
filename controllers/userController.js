const User = require('../Model/userModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const customError = require('../Utilities/customError')

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

const filterReqObject = (obj, ...fields) => {
  const newObj = {}
  Object.keys(obj).forEach((prop) => {
    if (fields.includes(prop)) {
      newObj[prop] = obj[prop]
    }
  })

  return newObj
}

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  // const user = await User.findById(req.user.id)

  // if (user.role === 'user')
  //   return next(
  //     new customError(
  //       'You do not have privilages to view the users. Contact the admin!!'
  //     )
  //   )

  const users = await User.find()

  res.status(200).json({
    status: 'Success',
    totalUsers: users.length,
    users: {
      users,
    },
  })
})

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password')

  if (
    !(await user.comparePasswordDB(req.body.currentPassword, user.password))
  ) {
    return next(
      new customError('The current password provided is incorrect', 401)
    )
  }

  user.password = req.body.password
  user.confirmPassword = req.body.confirmPassword

  await user.save()

  const updatedPasswordToken = signToken(user._id)

  res.status(200).json({
    status: 'Success',
    message: 'Password has been updated successfully!!',
    userLogged: `The logged in user is ${user.email} with an id ${user._id}`,
    updatedPasswordToken,
  })
})

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new customError('This link used to update the user details only!!', 400)
    )
  }

  const filterObj = filterReqObject(req.body, 'email', 'name')
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterObj, {
    runValidators: true,
    new: true,
  })

  res.status(200).json({
    status: 'Success',
    message: 'User details has been updated successfully!!',
    data: {
      user: updatedUser,
    },
  })
})

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  })

  res.status(200).json({
    status: 'Success',
    message: 'The User deleted successfully!!',
    user,
  })
})
