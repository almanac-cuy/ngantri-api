const HttpError = require('../../helpers/HttpError')
const Instance = require('../models/Instances')
const Category = require('../models/Categories')
const {
	validateInstanceInput,
	validateServiceInput,
} = require('../../validators/instances')
const fs = require('fs')
const cloudinary = require('../../config/cloudinary')

module.exports = {
	addInstance: async (req, res) => {
		try {
			const {
				name,
				address,
				cat_id,
				cat_name,
				// image,
				latitude,
				longitude,
			} = req.body

			const { errors, isValid } = validateInstanceInput(req.body)

			const { image } = req.files || {}
			if (!image) {
				throw new HttpError(400, 'Bad Request', { image: 'No File Selected' })
			}

			const filetypes = /jpeg|jpg|png|gif/
			const mimetype = filetypes.test(image.mimetype)
			if (!mimetype) {
				try {
					fs.unlinkSync(image.tempFilePath)
					throw new HttpError(400, 'Bad Request', 'File Must be an Image')
				} catch (err) {
					HttpError.handle(res, err)
				}
			}

			if (!isValid) {
				fs.unlink(image.tempFilePath, err => {
					if (err) {
						console.log('Cannot Delete File')
					}
				})
				throw new HttpError(400, 'Bad Request', errors)
			}

			const findCat = await Category.find()

			const currentCat = findCat.filter(
				cat => cat.id === cat_id && cat.name === cat_name
			)
			if (currentCat.length === 0) {
				fs.unlink(image.tempFilePath, err => {
					if (err) {
						console.log('Cannot Delete File')
					}
				})
				throw new HttpError(400, 'Bad Request', {
					cat_id: 'Wrong category',
					cat_name: 'Wrong category',
				})
			}

			const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath)
			fs.unlink(image.tempFilePath, err => {
				if (err) {
					console.log('Cannot Delete File')
				}
			})
			const newInstane = new Instance({
				name,
				address,
				categories: {
					cat_id,
					cat_name,
				},
				image: uploadedImage.url,
				latitude,
				longitude,
			})
			const result = await newInstane.save()
			res.json({
				code: 200,
				status: 'Succes Add Instance',
				instance: result,
			})
		} catch (error) {
			const { image } = req.files || {}
			fs.unlink(image.tempFilePath, err => {
				if (err) {
					console.log('Cannot Delete File')
				}
			})
			HttpError.handle(res, error)
		}
	},
	showOneInstance: async (req, res) => {
		try {
			const result = await Instance.findById(req.params.id)
			if (!result) {
				throw new HttpError(404, 'Not Found', 'Instance not found')
			}
			res.json({
				code: 200,
				status: 'OK',
				instance: result,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	searchInstance: async (req, res) => {
		try {
			const { name, address, cat_id } = req.query
			let conditions = {}

			if (!cat_id) {
				throw new HttpError(400, 'Bad Request', 'Should enter cat_id')
			} else {
				conditions = { ...conditions, 'categories.cat_id': cat_id }
			}

			if (name) {
				conditions = { ...conditions, name: { $regex: name, $options: 'i' } }
			}
			if (address) {
				conditions = {
					...conditions,
					address: { $regex: address, $options: 'i' },
				}
			}

			const result = await Instance.find(conditions)
			if (result.length === 0) {
				throw new HttpError(404, 'Not Found', 'Instance is empty')
			}
			res.json({
				code: 200,
				status: 'Succes Get Instances',
				instance: result,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	addService: async (req, res) => {
		try {
			const { errors, isValid } = validateServiceInput(req.body)
			if (!isValid) {
				throw new HttpError(400, 'Bad request', errors)
			}

			const result = await Instance.findById(req.params.id)
			if (!result) {
				throw new HttpError(404, 'Not Found', 'Instance not found')
			}
			const newService = {
				name: req.body.name,
				duration: req.body.duration,
			}

			result.services.unshift(newService)
			const saved = await result.save()

			res.json({
				code: 200,
				status: 'Succes Add Service',
				instance: saved,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	showServices: async (req, res) => {
		try {
			const result = await Instance.findById(req.params.id)
			if (!result) {
				throw new HttpError(404, 'Not Found', 'Cannot find instance')
			}
			const services = result.services
			res.json({
				code: 200,
				status: 'OK',
				services,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	deleteInstance: async (req, res) => {
		try {
			const getInstance = await Instance.findById(req.params.id)
			if (!getInstance) {
				throw new HttpError(404, 'Not Found', 'Cannot find Instance')
			}

			await Instance.deleteOne({ _id: req.params.id })
			res.json({
				code: 200,
				status: 'OK',
				message: 'Succes Delete',
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
}
