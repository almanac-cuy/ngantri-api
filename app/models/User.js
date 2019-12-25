const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	email: {
		type: String,
		required: [true, 'Email Cannot Empty'],
	},
	name: {
		type: String,
		required: [true, 'Name Cannot Empty'],
	},
	phone: {
		type: Number,
		required: [true, 'Phone Number Cannot Empty'],
	},
	isVeryfied: {
		type: Boolean,
		required: true,
		default: false,
	},
	avatar: {
		type: String,
	},
	password: {
		type: String,
		required: [true, 'Password Cannot Empty'],
		minlength: [6, 'Password must atleast 6 characters long'],
	},
})

module.exports = User = mongoose.model('users', UserSchema)
