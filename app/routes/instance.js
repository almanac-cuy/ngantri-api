const express = require('express')
const Router = express.Router()
const instaneController = require('../controllers/instances')

Router.post('/', instaneController.addInstance)
Router.get('/search', instaneController.searchInstance)
Router.get('/:id', instaneController.showOneInstance)
// Router.get('/services/:id', instaneController.showOneInstance)
Router.post('/services/:id', instaneController.addService)

module.exports = Router
