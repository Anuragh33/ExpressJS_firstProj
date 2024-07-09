const express = require('express')
const authController = require('../controllers/authContoller')
const userController = require('../controllers/userController')

const router = express.Router()

router.use(authController.protect)

router.route('/me').get(userController.getMe, userController.getUser)

router
  .route('/updateMe')
  .patch(userController.userUploadPhoto, userController.updateMe)

router.use(authController.restrictRole('admin'))

router.route('/allusers').get(userController.getAllUsers)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router
