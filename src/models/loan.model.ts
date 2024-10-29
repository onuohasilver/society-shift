import mongoose, { Schema, Document } from 'mongoose'
import {
  LoanStatus,
  LoanType,
  RepaymentScheduleType,
  RepaymentStatus,
} from '../types/finance/loan.types'

export interface LoanDocument extends LoanType, Document {}

const RepaymentScheduleSchema: Schema = new Schema<RepaymentScheduleType>({
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(RepaymentStatus),
    required: true,
  },
})

const LoanSchema: Schema = new Schema<LoanDocument>(
  {
    businessId: { type: String, required: true },
    userId: { type: String, required: true },
    balance: { type: Number, required: true },
    loanAmount: { type: Number },
    interestRate: { type: Number },
    repaymentSchedule: [RepaymentScheduleSchema],
    duration: { type: Number, required: true },
    loanStatus: {
      type: String,
      enum: Object.values(LoanStatus),
      default: LoanStatus.Active,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
)

export default mongoose.model<LoanDocument>('Loan', LoanSchema)
