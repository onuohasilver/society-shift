import { Request, Response } from 'express'
import { LoanInteractor } from '../interactors/loan.interactor'
import { LoanType } from '../types/finance/loan.types'
import formatResponse from '../utilities/format.response'

export const LoanController = () => {
  const applyForLoan = async (req: Request, res: Response) => {
    const userId = req.body.user._id
    const loanData = req.body as LoanType
    loanData.userId = userId
    const response = await LoanInteractor().applyForLoan(loanData)
    return formatResponse(res, response.code, response.message, response.data)
  }

  const repayLoan = async (req: Request, res: Response) => {
    const loanId = req.params.loanId
    const repaymentData = req.body
    const response = await LoanInteractor().repayLoan(loanId, repaymentData)
    return formatResponse(res, response.code, response.message, response.data)
  }

  const getLoanById = async (req: Request, res: Response) => {
    const loanId = req.params.loanId
    const response = await LoanInteractor().getLoanById(loanId)
    return formatResponse(res, response.code, response.message, response.data)
  }

  const updateLoanStatus = async (req: Request, res: Response) => {
    const loanId = req.params.loanId
    const { status } = req.body
    const response = await LoanInteractor().updateLoanStatus(loanId, status)
    return formatResponse(res, response.code, response.message, response.data)
  }

  return {
    applyForLoan,
    repayLoan,
    getLoanById,
    updateLoanStatus,
  }
}
