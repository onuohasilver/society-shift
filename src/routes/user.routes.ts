import { UserController } from '../controllers/user.controller'
import * as express from 'express'
import verifyGoogleToken from '../middleware/verify.google.auth'
import { verifyAccessToken } from '../middleware/verify.access.token'
import { validateRequest } from '../middleware/validate.request'
import {
  createUserSchema,
  getUserByIdSchema,
  updateUserSchema,
} from '../validation/user.validation'
const router = express.Router()

const { createUser, getUserById, updateUser } = UserController()

router.post(
  '/register',
  verifyGoogleToken,
  validateRequest(createUserSchema),
  createUser
)
router.patch(
  '/update',
  validateRequest(updateUserSchema),
  verifyAccessToken,
  updateUser
)
router.get(
  '/:userId',
  verifyAccessToken,
  validateRequest(getUserByIdSchema, 'params'),
  getUserById
)

export default router
1
