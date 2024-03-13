import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import listingRouter from './routes/listing.routes.js'
import cookieParese from 'cookie-parser'
import path from 'path'

dotenv.config()

mongoose.connect(process.env.MONGO_DB_URL).then(() => {
    console.log('DB CONNECTED')
}).catch((err) => {
    console.error(`Error connecting to the database: ${err}`)
})

const __dirname = path.resolve()

const app = express()

app.use(express.json())
app.use(cookieParese())

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    res.status(statusCode).send({
        success: false,
        statusCode,
        message
    })
})