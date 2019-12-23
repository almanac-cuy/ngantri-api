const User = require('../models/User')
const { hash, genSalt } = require('bcryptjs')
const HttpError = require('../../helpers/HttpError')
const gravatar = require('gravatar')

const { validateRegisterInput } = require('../../validators/user')

module.exports = {
	register: async (req, res) => {
		try {
			const { email, password, phone, name } = req.body

			const getUser = await User.findOne({ email: req.body.email })

			if (getUser) {
				throw new HttpError(200, 'Bad Request', 'User already exists')
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
			const result = await User.findOne({ email: req.body.email })
			const user = JSON.parse(JSON.stringify(result))
			delete user.password
			res.json(user)
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
}
