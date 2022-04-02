const express = require('express')
const userController = require('../controllers/userController')
const route = express.Router()
const {authToken, authTokenAdmin} = require('../middlewares/authToken')

route.get('/', authToken, userController.homePage)
route.get('/login', userController.loginPage)
route.get('/delete-user/:id', authTokenAdmin, userController.deleteUser)
route.get('/register', userController.registerPage)

module.exports = route 