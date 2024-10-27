import { EmployeeController } from '../controllers/employee.controller'
import * as express from 'express'
import { verifyAccessToken } from '../middleware/verify.access.token'

const router = express.Router()
const { applyForJob, fetchAllEmployees, updateEmployeeStatus } =
  EmployeeController()
router.post('/:businessId/apply-for-job/', verifyAccessToken, applyForJob)
router.get('/:businessId/:status', verifyAccessToken, fetchAllEmployees)
router.patch('/:employeeId', verifyAccessToken, updateEmployeeStatus)

export default router
