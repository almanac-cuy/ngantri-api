const Validator = require('validator')
const isEmpty = require('./isEmpty')

const validateRegisterInput = data => {
	let errors = {}

	data.email = !isEmpty(data.email) ? data.email : ''
	data.name = !isEmpty(data.name) ? data.name : ''
	data.password = !isEmpty(data.password) ? data.password : ''
	data.phone = !isEmpty(data.phone) ? data.phone : ''

	if (!Validator.isEmail(data.email)) {
		errors.email = 'Email is invalid'
	}

	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required'
	}
	if (Validator.isEmpty(data.name)) {
		errors.name = 'Name field is required'
	}

	if (!Validator.isInt(data.phone)) {
		errors.phone = 'Phone Should be a number'
	}
	if (Validator.isEmpty(data.phone)) {
		errors.phone = 'Phone field is required'
	}
	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Password must be at least 6 characters'
	}

	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required'
	}

	return {
		errors,
		isValid: isEmpty(errors),
	}
}
const validateLoginInput = data => {
	let errors = {}

	data.email = !isEmpty(data.email) ? data.email : ''
	data.password = !isEmpty(data.password) ? data.password : ''

	if (!Validator.isEmail(data.email)) {
		errors.email = 'Email is invalid'
	}

	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required'
	}

	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Password must be at least 6 characters'
	}

	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required'
	}

	return {
		errors,
		isValid: isEmpty(errors),
	}
}

module.exports = {
	validateRegisterInput,
	validateLoginInput,
}
