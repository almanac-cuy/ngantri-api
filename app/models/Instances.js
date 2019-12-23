const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InstancesSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	categories: {
		type: Object,
		cat_id: {
			type: Schema.Types.ObjectId,
			ref: 'categories',
		},
		name: {
			type: String,
			ref: 'categories',
		},
		required: true,
	},
	services: [
		{
			name: {
				type: String,
				required: true,
			},
		},
	],
	image: {
		type: String,
		required: true,
	},
	latitude: {
		type: Number,
		required: true,
	},
	longitude: {
		type: Number,
		required: true,
	},
})

module.exports = Categories = mongoose.model('instances', InstancesSchema)
