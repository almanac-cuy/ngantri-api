const User = require('../models/User')
const { hash, genSalt, compare } = require('bcryptjs')
const HttpError = require('../../helpers/HttpError')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const messagebird = require('../../config/messagebird')
const {
	validateRegisterInput,
	validateLoginInput,
} = require('../../validators/user')

module.exports = {
	register: async (req, res) => {
		try {
			const { email, password, phone, name } = req.body

			const getUser = await User.findOne({ email: req.body.email })

			if (getUser) {
				throw new HttpError(400, 'Bad Request', 'User already exists')
			}

			const { errors, isValid } = validateRegisterInput(req.body)

			if (!isValid) {
				throw new HttpError(400, 'Bad Request', errors)
			}

			const avatar = gravatar.url(email, {
				s: 250,
				r: 'pg',
				d: 'identicon',
			})

			const newUser = new User({
				name,
				email,
				avatar,
				password,
				phone,
			})

			let newPhone = phone.toString()

			if (newPhone.charAt(0) === '0') {
				newPhone = newPhone.replace(newPhone.charAt(0), '62')
			}
			newUser.phone = newPhone

			const salt = await genSalt(10)
			const hashedPassword = await hash(newUser.password, salt)

			newUser.password = hashedPassword

			const user = await newUser.save()

			res.status(200).json({
				code: 200,
				status: 'OK',
				message: 'Succes register',
				user,
			})
		} catch (err) {
			HttpError.handle(res, err)
		}
	},

	loginUser: async (req, res) => {
		try {
			const { errors, isValid } = validateLoginInput(req.body)

			if (!isValid) {
				throw new HttpError(400, 'Bad Request', errors)
			}

			const { email, password } = req.body
			const result = await User.findOne({ email })

			if (!result) {
				throw new HttpError(404, 'Not Found', 'User not found')
			}

			const user = JSON.parse(JSON.stringify(result))

			const isPasswordMatch = await compare(password, user.password)
			if (!isPasswordMatch) {
				throw new HttpError(400, 'Bad Request', 'Wrong Password')
			}

			delete user.password

			jwt.sign(user, process.env.JWT_SECRET, (err, token) => {
				res.json(token)
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	verifyUser: (req, res) => {
		try {
			const { phone } = req.body

			messagebird.verify.create(
				phone,
				{
					originator: 'Ngantri.app',
					template: 'Your verification code is %token. ',
				},
				(err, response) => {
					if (err) {
						console.log(err)
						throw new HttpError(400, 'Bad Request', err.errors[0].description)
					} else {
						console.log(response)
						req.messagebird_id = response.id
						res.json({
							message: 'Succes send token',
							id: response.id,
						})
					}
				}
			)
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	checkVerify: (req, res) => {
		const id = req.messagebird_id
		const { token } = req.body

		messagebird.verify.verify(id, token, function(err, response) {
			if (err) {
				// Verification has failed
				console.log(err)
				// res.render('step2', {
				// 	error: err.errors[0].description,
				// 	id: id,
				// })
				return res.status(400).json(err.errors[0].description)
			} else {
				// Verification was successful
				console.log(response)
				res.json(response)
			}
		})
	},
}
