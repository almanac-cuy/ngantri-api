const express = require('express')
const Router = express.Router()
const instaneController = require('../controllers/instances')
const historyInstance = require('../controllers/HistoryInstance')

Router.post('/', instaneController.addInstance)
Router.get('/search', instaneController.searchInstance)
Router.get('/:id', instaneController.showOneInstance)
Router.get('/history/:id', historyInstance.getInstanceHistory)
Router.post('/history/:id', historyInstance.addHistory)
Router.delete('/:id', instaneController.deleteInstance)
Router.get('/services/:id', instaneController.showServices)
Router.post('/services/:id', instaneController.addService)
Router.patch('/services/:id/:service_id', instaneController.editService)

module.exports = Router
