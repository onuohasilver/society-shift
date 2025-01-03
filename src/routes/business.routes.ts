import * as express from 'express'
import { BusinessController } from '../controllers/business.controller'
import { verifyAccessToken } from '../middleware/verify.access.token'
const router = express.Router()
const {
  createBusiness,
  getBusinessById,
  updateBusiness,
  createNewBranch,
  fetchAllBusinessBranches,
} = BusinessController()

router.post('/create', verifyAccessToken, createBusiness)
router.get('/:id', verifyAccessToken, getBusinessById)
router.patch('/:id', verifyAccessToken, updateBusiness)
router.post('/:id/branch', verifyAccessToken, createNewBranch)
router.get('/:id/branches', verifyAccessToken, fetchAllBusinessBranches)

export default router
