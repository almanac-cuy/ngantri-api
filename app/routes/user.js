const express = require('express')
const Router = express.Router()
const userController = require('../controllers/user')

Router.post('/register', userController.register)
Router.post('/login', userController.loginUser)
Router.patch('/profile/:id', userController.editUserData)
Router.patch('/profile/image/:id', userController.editUserImage)

module.exports = Router
