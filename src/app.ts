import * as express from 'express'
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import userRoutes from '../src/routes/user.routes'

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/user', userRoutes)

export default app