const express = require('express')
const Router = express.Router()
const historyController = require('../controllers/History')

Router.post('/new/:user_id', historyController.addNewUserHistory)
Router.get('/:user_id', historyController.getUserHistory)
Router.get('/on-going/:user_id', historyController.getUserOnGoing)
Router.patch('/:user_id/:history_id', historyController.updateHistory)

module.exports = Router
