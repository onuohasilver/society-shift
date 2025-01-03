import * as express from 'express'
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import userRoutes from '../src/routes/user.routes'
import businessRoutes from '../src/routes/business.routes'
import employeeRoutes from '../src/routes/employee.routes'
import locationRoutes from '../src/routes/location.routes'
import loanRoutes from '../src/routes/loan.routes'
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
app.use('/business', businessRoutes)
app.use('/employee', employeeRoutes)
app.use('/location', locationRoutes)
app.use('/loan', loanRoutes)

export default app
