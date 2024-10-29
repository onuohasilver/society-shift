import { LoanController } from '../controllers/loan.controller'
import * as express from 'express'
import { verifyAccessToken } from '../middleware/verify.access.token'
import { validateRequest } from '../middleware/validate.request'
import {
  applyForLoanSchema,
  repayLoanSchema,
  getLoanByIdSchema,
  loanStatusSchema,
} from '../validation/loan.validation'

const router = express.Router()

const { applyForLoan, repayLoan, getLoanById, updateLoanStatus } =
  LoanController()

router.post(
  '/apply',
  validateRequest(applyForLoanSchema),
  verifyAccessToken,
  applyForLoan
)

router.patch(
  '/repay/:loanId',
  validateRequest(repayLoanSchema),
  validateRequest(getLoanByIdSchema, 'params'),
  verifyAccessToken,
  repayLoan
)

router.get(
  '/:loanId',
  verifyAccessToken,
  validateRequest(getLoanByIdSchema, 'params'),
  getLoanById
)

router.patch(
  '/status/:loanId',
  validateRequest(getLoanByIdSchema, 'params'),
  validateRequest(loanStatusSchema),
  verifyAccessToken,
  updateLoanStatus
)

export default router
