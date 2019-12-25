const express = require('express')
const Router = express.Router()
const userController = require('../controllers/user')

Router.post('/register', userController.register)
Router.post('/login', userController.loginUser)
Router.post('/req-verify', userController.verifyUser)
Router.post('/check-verify', userController.checkVerify)

module.exports = Router
