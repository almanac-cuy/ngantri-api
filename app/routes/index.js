const express = require('express')
const user = require('./user')
const category = require('./categories')
const instances = require('./instance')
const history = require('./history')
const { verifyToken, verifyUser } = require('../../middlewares/auth')
const Router = express.Router()

Router.use('/user', user)
Router.use('/category', category)
Router.use('/instances', instances)
Router.use('/history', history)

module.exports = Router
