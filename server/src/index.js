import authRoutes from './routes/auth.js'

import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import cors from 'cors'
import taskRoutes from './routes/tasks.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json())

app.use('/api/tasks', taskRoutes)
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})