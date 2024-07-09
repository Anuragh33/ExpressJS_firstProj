const express = require('express')

const router = express.Router()

const viewController = require('../controllers/viewConroller')
const authController = require('../controllers/authContoller')

router.get('/me', authController.protect, viewController.getMe)

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
)

router.use(authController.isLoggedIn)

router.get('/', viewController.getOverview)

router.get('/movie/:slug', viewController.getMovie)

router.get('/login', viewController.login)

module.exports = router
