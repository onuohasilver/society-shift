import LoanModel from '../models/loan.model'
import { LoanDocument } from '../models/loan.model'
import { Messages } from '../data/errors'
import {
  LoanStatus,
  LoanType,
  RepaymentScheduleType,
  RepaymentStatus,
} from '../types/finance/loan.types'
import {
  saveAndReturn,
  updateIfFound,
  returnIfNotDeleted,
} from '../utilities/mongoose'

export const LoanInteractor = () => {
  /**
   * Creates a new loan application with repayment schedule
   *
   * @param {LoanType} loanData - The loan application data including amount, duration etc
   * @returns {Promise<{ message: string, data: LoanDocument | null, code: number }>} Response containing the created loan or error
   *
   * @description
   * This function performs the following steps:
   * 1. Sets initial loan balance equal to loan amount
   * 2. Generates monthly repayment schedule based on loan amount and duration
   * 3. Creates and saves the loan document
   */
  const applyForLoan = async (loanData: LoanType) => {
    return await saveAndReturn<LoanDocument>({
      model: LoanModel,
      data: loanData,
      successMessage: Messages.LOAN_CREATED,
      preProcess: async (data) => {
        // Set initial balance
        data.balance = data.loanAmount

        // Calculate monthly repayment amount
        const monthlyPayment = data.loanAmount / data.duration
        const today = new Date()

        // Generate repayment schedule with monthly intervals
        data.repaymentSchedule = Array.from(
          { length: data.duration },
          (_, i) => {
            const dueDate = new Date(today)
            dueDate.setMonth(dueDate.getMonth() + i + 1)
            return {
              amount: monthlyPayment,
              dueDate,
              status: RepaymentStatus.Pending,
              paidAmount: 0,
              id: i.toString(),
            }
          }
        )
        return { shouldProceed: true }
      },
    })
  }

  /**
   * Records a repayment against a loan
   *
   * @param {string} loanId - The ID of the loan being repaid
   * @param {RepaymentScheduleType} repaymentData - The repayment details
   * @returns {Promise<{ message: string, data: LoanDocument | null, code: number }>} Response containing the updated loan or error
   *
   * @description
   * This function performs the following steps:
   * 1. Updates the loan balance by subtracting the repayment amount
   * 2. Updates the specific repayment schedule entry with new status
   * 3. Returns the updated loan document
   */
  const repayLoan = async (
    loanId: string,
    repaymentData: RepaymentScheduleType
  ) => {
    return await updateIfFound<LoanDocument>({
      model: LoanModel,
      id: loanId,
      updateData: {
        repaymentSchedule: [repaymentData],
      },
      updatedMessage: Messages.LOAN_UPDATED,
      preProcess: async (data, loan) => {
        // Reduce loan balance by repayment amount
        data.balance = loan.balance - repaymentData.amount

        // Update the specific repayment schedule entry
        data.repaymentSchedule = loan.repaymentSchedule.map(
          (schedule: RepaymentScheduleType) =>
            schedule.id === repaymentData.id ? repaymentData : schedule
        )
        return { shouldProceed: true, result: data }
      },
    })
  }

  /**
   * Retrieves a loan by its ID if it exists and is not deleted
   *
   * @param {string} loanId - The ID of the loan to retrieve
   * @returns {Promise<{ message: string, data: LoanDocument | null, code: number }>} Response containing the loan or error
   *
   * @description
   * This function performs the following steps:
   * 1. Attempts to find the loan by ID
   * 2. Verifies the loan exists and is not marked as deleted
   * 3. Returns the loan document if found
   */
  const getLoanById = async (loanId: string) => {
    const userFields = '_id name email'
    const businessFields = 'name _id'
    return await returnIfNotDeleted<LoanDocument>({
      model: LoanModel,
      id: loanId,
      notFoundMessage: Messages.NOT_FOUND,
      deletedMessage: Messages.ALREADY_DELETED,
      populate: [
        {
          path: 'userId',
          select: userFields,
          model: 'User',
        },
        {
          path: 'businessId',
          select: businessFields,
          model: 'Business',
        },
      ],
    })
  }

  /**
   * Updates the status of a loan
   *
   * @param {string} loanId - The ID of the loan to update
   * @param {LoanStatus} status - The new status to set for the loan (active, repaid, or defaulted)
   * @returns {Promise<{ message: string, data: LoanDocument | null, code: number }>} Response containing the updated loan or error
   *
   * @description
   * This function performs the following steps:
   * 1. Finds the loan by ID and verifies it exists
   * 2. Updates the loan status to the provided value
   * 3. Returns the updated loan document
   */
  const updateLoanStatus = async (loanId: string, status: LoanStatus) => {
    // Use utility function to handle update logic including validation
    return await updateIfFound<LoanDocument>({
      model: LoanModel,
      id: loanId,
      updateData: { loanStatus: status },
    })
  }

  return {
    applyForLoan,
    repayLoan,
    getLoanById,
    updateLoanStatus,
  }
}
