const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ServiceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	currentQueue: {
		type: Number,
		required: true,
	},
	totalQueue: {
		type: Number,
		required: true,
	},
	totalQueueAlltime: {
		type: Number,
	},
})

module.exports = Services = mongoose.model('services', ServiceSchema)
