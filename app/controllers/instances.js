const HttpError = require('../../helpers/HttpError')
const Instance = require('../models/Instances')
const Category = require('../models/Categories')

module.exports = {
	addInstance: async (req, res) => {
		try {
			const {
				name,
				address,
				cat_id,
				cat_name,
				image,
				latitude,
				longitude,
			} = req.body

			const findCat = await Category.find()

			const currentCat = findCat.filter(
				cat => cat.id === cat_id && cat.name === cat_name
			)
			if (currentCat.length === 0) {
				throw new HttpError(400, 'Bad Request', 'Wrong Category')
			}

			const newInstane = new Instance({
				name,
				address,
				categories: {
					cat_id,
					cat_name,
				},
				image,
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
			const result = await Instance.findById(req.params.id)
			if (!result) {
				throw new HttpError(404, 'Not Found', 'Instance not found')
			}
			const newService = {
				name: req.body.name,
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
}
