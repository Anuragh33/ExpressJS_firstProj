const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
//const argon2 = require('argon2')

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
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'Please enter a password to continue!!'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password!!'],
    validate: {
      validator: function (val) {
        return val === this.password
      },
      message: 'Passwords need to match!!',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpire: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
})

userScheme.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  this.confirmPassword = undefined
  next()
})

userScheme.methods.comparePasswordDB = async function (pwd, pwdDB) {
  return await bcrypt.compare(pwd, pwdDB)
}

userScheme.methods.isPasswordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return JWTTimestamp > changedTimestamp
  }

  return false
}

userScheme.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

userScheme.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } })
  next()
})

const User = mongoose.model('User', userScheme)

module.exports = User

///
