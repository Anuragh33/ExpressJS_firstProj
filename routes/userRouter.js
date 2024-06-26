const express = require('express')
const authController = require('../controllers/authContoller')
const userController = require('../controllers/userController')

const router = express.Router()

router
  .route('/updatepassword')
  .patch(authController.protect, userController.updatePassword)

router
  .route('/updateuser')
  .patch(authController.protect, userController.updateUser)
router
  .route('/deleteuser')
  .delete(authController.protect, userController.deleteUser)

router
  .route('/allusers')
  .get(authController.protect, userController.getAllUsers)

module.exports = router