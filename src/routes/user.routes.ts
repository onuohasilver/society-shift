import { UserController } from '../controllers/user.controller'
import * as express from 'express'
import verifyGoogleToken from '../middleware/verify.google.auth'
import { verifyToken } from '../services/auth/create.token.service'
import { verifyAccessToken } from '../middleware/verify.access.token'
const router = express.Router()

const { createUser, getUserById, updateUser } = UserController()

router.post('/register', verifyGoogleToken, createUser)
router.patch('/update', verifyAccessToken, updateUser)
router.get('/:userId', verifyAccessToken, getUserById)

export default router
