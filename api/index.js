import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGO_DB_URL).then(() => {
    console.log('DB CONNECTED')
}).catch((err) => {
    console.error(`Error connecting to the database: ${err}`)
})

const app = express()

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
