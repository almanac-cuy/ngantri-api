const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HistoryInstanceSchema = new Schema({
	instance: {
		type: mongoose.Types.ObjectId,
		ref: 'users',
	},
	histories: [
		{
			date: {
				type: Date,
				required: true,
			},
			service: {
				type: mongoose.Types.ObjectId,
				required: true,
			},
			service_name: {
				type: String,
				required: true,
			},
			user: {
				type: mongoose.Types.ObjectId,
				required: true,
				ref: 'users',
			},
			user_name: {
				type: String,
				required: true,
			},
		},
	],
})

module.exports = HistoryInstance = mongoose.model(
	'instance_history',
	HistoryInstanceSchema
)
