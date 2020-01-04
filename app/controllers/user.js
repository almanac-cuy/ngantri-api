const User = require('../models/User')
const { hash, genSalt, compare } = require('bcryptjs')
const HttpError = require('../../helpers/HttpError')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const {
	validateRegisterInput,
	validateLoginInput,
} = require('../../validators/user')
const fs = require('fs')
const cloudinary = require('../../config/cloudinary')

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
	editUserImage: async (req, res) => {
		try {
			const { id } = req.params
			const result = await User.findOne({ _id: id })
			if (!result) {
				throw new HttpError(404, 'Not Found', 'User not found')
			}

			const { avatar } = req.files || {}
			if (!avatar) {
				throw new HttpError(400, 'Bad Request', { avatar: 'No File Selected' })
			}

			const filetypes = /jpeg|jpg|png|gif/
			const mimetype = filetypes.test(avatar.mimetype)
			if (!mimetype) {
				try {
					fs.unlinkSync(avatar.tempFilePath)
					throw new HttpError(400, 'Bad Request', 'File Must be an Image')
				} catch (err) {
					HttpError.handle(res, err)
				}
			}

			const uploadedImage = await cloudinary.uploader.upload(
				avatar.tempFilePath
			)
			fs.unlink(avatar.tempFilePath, err => {
				if (err) {
					console.log('Cannot Delete File')
				}
			})

			const user = await User.findOneAndUpdate(
				{ _id: id },
				{ avatar: uploadedImage.url }
			)
			res.status(200).json({
				code: 200,
				status: 'OK',
				message: 'Succes Update',
				user,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
	editUserData: async (req, res) => {
		try {
			const { id } = req.params
			const result = await User.findById(id)
			if (!result) {
				throw new HttpError(404, 'Not Found', 'User not found')
			}

			let data = {}

			if (req.body.name) {
				data.name = req.body.name
			}
			if (req.body.email) {
				data.email = req.body.email
			}
			if (req.body.phone) {
				data.phone = req.body.phone
			}

			const user = await User.findOneAndUpdate({ _id: id }, data)
			res.status(200).json({
				code: 200,
				status: 'OK',
				message: 'Succes Update',
				user,
			})
		} catch (error) {
			HttpError.handle(res, error)
		}
	},
}
