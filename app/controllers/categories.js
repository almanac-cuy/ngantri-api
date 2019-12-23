const Categories = require('../models/Categories')
const HttpError = require('../../helpers/HttpError')

module.exports = {
	addCategory: async (req, res) => {
		try {
			const { name } = req.body
			const newCat = new Categories({
				name,
			})
			const result = await newCat.save()
			res.json({
				code: 200,
				status: 'Succes Add Category',
				category: result,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	showAllCategory: async (req, res) => {
		try {
			const result = await Categories.find()
			if (!result) {
				throw new HttpError(404, 'Not Found', 'Categories is empty')
			}
			res.json({
				code: 200,
				status: 'OK',
				categories: result,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
}
