require('dotenv').config()
const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const morgan = require('morgan')
const fileUploads = require('express-fileupload')
const routes = require('./app/routes')
const cors = require('cors')

const server = express()

const PORT = process.env.PORT || 9400

server.use(morgan('dev'))
server.use(express.static('./public'))
server.use(
	fileUploads({
		useTempFiles: true,
		tempFileDir: './public/img',
	})
)
server.use('/api', routes)
server.use(cors())

server.get('/', (req, res) => {
	res.send('Welcome to Ngantri API 🎉🎉')
})

const app = http.createServer(server)

const start = async () => {
	try {
		await mongoose.connect(
			process.env.MONGO_URL,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
			err => {
				if (!err) {
					console.log('Database connection successful')
				}
			}
		)

		app.listen(PORT, () => {
			console.log(`Server Running on port ${PORT}`)
		})
	} catch (error) {
		console.log(error)
	}
}

start()
