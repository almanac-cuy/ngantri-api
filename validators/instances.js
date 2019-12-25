const Validator = require('validator')
const isEmpty = require('./isEmpty')

const validateInstanceInput = data => {
	let errors = {}

	data.name = !isEmpty(data.name) ? data.name : ''
	data.address = !isEmpty(data.address) ? data.address : ''
	data.cat_id = !isEmpty(data.cat_id) ? data.cat_id : ''
	data.cat_name = !isEmpty(data.cat_name) ? data.cat_name : ''
	data.latitude = !isEmpty(data.latitude) ? data.latitude : ''
	data.longitude = !isEmpty(data.longitude) ? data.longitude : ''

	if (!Validator.isLength(data.name, { min: 3 })) {
		errors.name = 'Name should atleast 3 characters'
	}
	if (Validator.isEmpty(data.name)) {
		errors.name = 'Name field cannot empty'
	}

	if (!Validator.isLength(data.address, { min: 3 })) {
		errors.address = 'Address should atleast 3 characters'
	}
	if (Validator.isEmpty(data.address)) {
		errors.address = 'Address field cannot empty'
	}

	if (Validator.isEmpty(data.cat_id)) {
		errors.cat_id = 'Category id field cannot empty'
	}

	if (Validator.isEmpty(data.cat_name)) {
		errors.cat_name = 'Category name field cannot empty'
	}

	if (!Validator.isFloat(data.latitude, { min: -90, max: 90 })) {
		errors.latitude = 'Latitude should be between -90 and 90'
	}
	if (Validator.isEmpty(data.latitude)) {
		errors.latitude = 'Latitude field cannot empty'
	}

	if (!Validator.isFloat(data.longitude, { min: -180, max: 180 })) {
		errors.longitude = 'Longitude should be between -180 and 180'
	}
	if (Validator.isEmpty(data.longitude)) {
		errors.longitude = 'Longitude field cannot empty'
	}
	return {
		errors,
		isValid: isEmpty(errors),
	}
}

const validateServiceInput = data => {
	let errors = {}
	data.name = !isEmpty(data.name) ? data.name : ''
	if (!Validator.isLength(data.name, { min: 3 })) {
		errors.name = 'Name should atleast 3 characters'
	}
	if (Validator.isEmpty(data.name)) {
		errors.name = 'Name field cannot empty'
	}
	if (data.duration < 600) {
		errors.duration = 'Duration should be atleast 10 minutes (600 seconds)'
	}
	if (Validator.isEmpty(data.duration)) {
		errors.duration = 'Duration field cannot empty'
	}
	return {
		errors,
		isValid: isEmpty(errors),
	}
}
module.exports = { validateInstanceInput, validateServiceInput }
