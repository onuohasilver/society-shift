interface RepaymentScheduleType {
  dueDate: Date
  amount: number
  status: RepaymentStatus
  id: string
}
export enum RepaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Missed = 'missed',
}

interface LoanType {
  businessId: string
  userId: string
  balance: number
  loanAmount?: number
  interestRate?: number
  repaymentSchedule?: RepaymentScheduleType[]
  loanStatus: LoanStatus
  duration: number
}

export enum LoanStatus {
  Active = 'active',
  Repaid = 'repaid',
  Defaulted = 'defaulted',
}

export type { LoanType, RepaymentScheduleType }
