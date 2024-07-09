const multer = require('multer')

const User = require('../Model/userModel')
const asyncErrorHandler = require('../Utilities/asyncErrorHandler')
const customError = require('../Utilities/customError')
const factoryFunc = require('./factoryFunction')

//Upload an Image

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
  },
})

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new customError('Only Images need to be uploaded ', 402), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

exports.userUploadPhoto = upload.single('photo')

exports.resizingPhotos = (req, res, next) => {
  if (!upload) return next()
}

///////////////////////////////////////////////////////////////

const filterReqObject = (obj, ...fields) => {
  const newObj = {}
  Object.keys(obj).forEach((prop) => {
    if (fields.includes(prop)) {
      newObj[prop] = obj[prop]
    }
  })

  return newObj
}

exports.getMe = (req, res, next) => {
  req.prams.id = req.user.id
  next()
}

exports.updateMe = asyncErrorHandler(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new customError('This link used to update the user details only!!', 400)
    )
  }

  const filterObj = filterReqObject(req.body, 'email', 'name')

  if (req.file) filterObj.photo = req.file.filename

  const updatedMe = await User.findByIdAndUpdate(req.user.id, filterObj, {
    runValidators: true,
    new: true,
  })

  res.status(200).json({
    status: 'Success',
    message: 'User details has been updated successfully!!',
    data: {
      user: updatedMe,
    },
  })
})
exports.getAllUsers = factoryFunc.getAll(User)
exports.updateUser = factoryFunc.updateOne(User)
exports.deleteUser = factoryFunc.deleteOne(User)
exports.getUser = factoryFunc.getOne(User)
