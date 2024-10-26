import * as express from 'express'
import * as cors from 'cors'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

export default app
