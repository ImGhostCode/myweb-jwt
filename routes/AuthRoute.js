const express = require('express')
const authController = require('../controllers/authController')
const route = express.Router()

route.post('/register', authController.registerUser)
route.get('/refresh-token', authController.refreshToken)
route.post('/login', authController.login)
route.get('/logout', authController.logout)

module.exports = route 