const HistoryInstance = require('../models/HistoryInstance')
const HttpError = require('../../helpers/HttpError')

module.exports = {
	getInstanceHistory: async (req, res) => {
		try {
			const result = await HistoryInstance.findOne({ instance: req.params.id })
			if (!result) {
				const newHistoy = new HistoryInstance({
					instance: req.params.id,
				})
				await newHistoy.save()
			}

			const history = await HistoryInstance.findOne({ instance: req.params.id })

			if (history.histories.length === 0) {
				throw new HttpError(404, 'Not FOund', 'Not Found')
			}

			res.json({
				code: 200,
				status: 'OK',
				history,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	addHistory: async (req, res) => {
		try {
			const history = await HistoryInstance.findOne({ instance: req.params.id })

			if (!history) {
				throw new HttpError(404, 'Not FOund', 'Not Found')
			}

			const historyData = {
				date: Date.now(),
				service: req.body.service,
				service_name: req.body.service_name,
				user: req.body.user,
				user_name: req.body.user_name,
			}

			history.histories.unshift(historyData)

			const result = await history.save()
			res.json(result)
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
}
