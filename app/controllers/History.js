const History = require('../models/History')
const HttpError = require('../../helpers/HttpError')

module.exports = {
	getUserHistory: async (req, res) => {
		try {
			const history = await History.findOne({ user: req.params.user_id })

			if (!history) {
				throw new HttpError(404, 'Not Found', 'Cannot find user')
			}

			if (history.histories.length === 0) {
				throw new HttpError(404, 'Not Found', 'History for this user is empty')
			}

			const userHistory = history.histories.filter(
				item => item.status === 'Done'
			)

			res.status(200).json({
				code: 200,
				stats: 'OK',
				history: userHistory,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	getUserOnGoing: async (req, res) => {
		try {
			const history = await History.findOne({ user: req.params.user_id })

			if (!history) {
				throw new HttpError(404, 'Not Found', 'Cannot find user')
			}

			if (history.histories.length === 0) {
				throw new HttpError(404, 'Not Found', 'History for this user is empty')
			}

			const userHistory = history.histories.filter(
				item => item.status !== 'Done'
			)

			res.status(200).json({
				code: 200,
				stats: 'OK',
				history: userHistory,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	addNewUserHistory: async (req, res) => {
		try {
			const history = await History.findOne({ user: req.params.user_id })
			if (!history) {
				const newUser = new History({
					user: req.params.user_id,
				})

				await newUser.save()
			}

			const AddHistory = await History.findOne({ user: req.params.user_id })

			const newHistories = {
				date: Date.now(),
				instance: req.body.instance_id,
				instance_name: req.body.instance_name,
				service: req.body.service,
			}

			AddHistory.histories.unshift(newHistories)
			const saved = await AddHistory.save()
			res.json(saved)
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	updateHistory: async (req, res) => {
		try {
			const history = await History.findOne({ user: req.params.user_id })
			if (!history) {
				throw new HttpError(404, 'Not Found', 'Cannot find user')
			}
			const updated = await History.update(
				{ 'histories._id': req.params.history_id },
				{ $set: { 'histories.$.status': 'Done' } }
			)
			res.json({
				msg: 'succes',
				updated,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
}
