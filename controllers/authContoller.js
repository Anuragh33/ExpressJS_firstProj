const express = require('express')
const User = require('../Model/userModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const customError = require('../Utilities/customError')
const util = require('util')

const signToken = (name, email, id) => {
  return jwt.sign(
    {
      name,
      email,
      id,
    },
    process.env.SECRET_STR,
    {
      expiresIn: process.env.LOGIN_EXPIRES,
    }
  )
}

exports.signUp = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body)

  const { name, email, _id } = newUser

  const token = signToken(name, email, _id)

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

exports.protect = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization

  let token

  if (!token) {
    return new customError('No Access!! login in first.', 401)
  }

  if (token && token.startsWith('bearer')) {
    token = testToken.split(' ')[1]
  }
  const decodedToken = util.promisify(jwt.verify(token, process.env.SECRET_STR))

  console.log(decodedToken)

  next()
})
