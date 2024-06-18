const mongoose = require('mongoose')
const validator = require('validator')

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is a mandatory field!!'],
  },
  email: {
    type: String,
    required: [true, 'Email is a mandatory field!!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password to continue!!'],
    minlength: 8,
    maxlength: 20,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password!!'],
  },
})

const User = mongoose.Model('User', userScheme)

module.exports = User
