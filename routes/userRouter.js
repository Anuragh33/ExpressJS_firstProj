const express = require('express')
const authController = require('../controllers/authContoller')
const userController = require('../controllers/userController')

const router = express.Router()

router
  .route('/me')
  .get(authController.protect, userController.getMe, userController.getUser)

router.route('/updateMe').patch(authController.protect, userController.updateMe)
router
  .route('/deleteuser')
  .delete(authController.protect, userController.deleteUser)

router.route('/updateuser').delete(userController.updateUser)

router
  .route('/allusers')
  .get(authController.protect, userController.getAllUsers)

router.route('/:id').get(authController.protect, userController.getUser)

module.exports = router
