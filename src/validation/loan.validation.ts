import { ValidationSchema } from '../middleware/validate.request'
import { LoanStatus, RepaymentStatus } from '../types/finance/loan.types'

export const applyForLoanSchema: ValidationSchema = {
  businessId: {
    type: 'string',
    required: true,
    pattern: /^[0-9a-fA-F]{24}$/, // MongoDB ObjectId pattern
  },
  loanAmount: {
    type: 'number',
    required: true,
    min: 0,
  },
  interestRate: {
    type: 'number',
    required: true,
    min: 0,
    max: 100,
  },
  duration: {
    type: 'number',
    required: true,
    min: 1,
  },
  loanStatus: {
    type: 'string',
    required: true,
    enum: Object.values(LoanStatus),
  },
}

export const repayLoanSchema: ValidationSchema = {
  amount: {
    type: 'number',
    required: true,
    min: 0,
  },
  dueDate: {
    type: 'string',
    required: true,
  },
  status: {
    type: 'string',
    required: true,
    enum: Object.values(RepaymentStatus),
  },
  id: {
    type: 'string',
    required: true,
  },
}

export const getLoanByIdSchema: ValidationSchema = {
  loanId: {
    type: 'string',
    required: true,
    pattern: /^[0-9a-fA-F]{24}$/,
  },
}

export const loanStatusSchema: ValidationSchema = {
  status: {
    type: 'string',
    required: true,
    enum: Object.values(LoanStatus),
  },
}
