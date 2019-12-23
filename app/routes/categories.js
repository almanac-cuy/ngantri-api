const express = require('express')
const Router = express.Router()
const categoryController = require('../controllers/categories')

Router.post('/', categoryController.addCategory)
Router.get('/', categoryController.showAllCategory)

module.exports = Router
