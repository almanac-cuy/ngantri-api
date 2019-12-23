const express = require('express')
const Router = express.Router()
const userController = require('../controllers/user')

Router.post('/register', userController.register)
Router.post('/login', userController.loginUser)

module.exports = Router
