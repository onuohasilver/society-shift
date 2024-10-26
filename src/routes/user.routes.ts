import { UserController } from '../controllers/user.controller'
import * as express from 'express'
import verifyGoogleToken from '../middleware/verify.google.auth'
const router = express.Router()

const { createUser } = UserController()

router.post('/register', verifyGoogleToken, createUser)

export default router
