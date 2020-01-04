const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HistorySchema = new Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'users',
	},
	histories: [
		{
			date: {
				type: Date,
				required: true,
			},
			instance: {
				type: mongoose.Types.ObjectId,
				required: true,
			},
			instance_name: {
				type: String,
				required: true,
			},
			service: {
				type: String,
				required: true,
			},
			status: {
				type: String,
				required: true,
				default: 'Not Done',
			},
		},
	],
})

module.exports = History = mongoose.model('history', HistorySchema)
