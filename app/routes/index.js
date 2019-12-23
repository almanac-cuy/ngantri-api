const express = require('express')
const user = require('./user')
const Router = express.Router()

Router.use('/user', user)

module.exports = Router
