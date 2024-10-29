import { LocationController } from '../controllers/location.controller'
import * as express from 'express'
import { validateRequest } from '../middleware/validate.request'
import {
  createLocationSchema,
  updateLocationSchema,
  getLocationSchema,
} from '../validation/location.validation'
import { verifyAccessToken } from '../middleware/verify.access.token'

const router = express.Router()

const { createLocation, getLocations, updateLocation } = LocationController()

router.post(
  '/',
  verifyAccessToken,
  validateRequest(createLocationSchema),
  createLocation
)

router.get(
  '/',
  verifyAccessToken,
  getLocations
)

router.patch(
  '/:id',
  verifyAccessToken,
  validateRequest(getLocationSchema, 'params'),
  validateRequest(updateLocationSchema),
  updateLocation
)

export default router
