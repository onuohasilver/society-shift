import { Request, Response } from 'express'
import { EmployeeInteractor } from '../interactors/employee.interactor'
import formatResponse from '../utilities/format.response'

export const EmployeeController = () => {
  const applyForJob = async (req: Request, res: Response) => {
    const { businessId } = req.params
    const { role } = req.body
    const employeeData = {
      owner: req.body.user.id,
      businessId,
      role,
    }
    const response = await EmployeeInteractor().applyForJob(employeeData)
    return formatResponse(res, response.code, response.message, response.data)
  }

  const fetchAllEmployees = async (req: Request, res: Response) => {
    const { businessId, status } = req.params
    const { page, limit } = req.query
    const response = await EmployeeInteractor().fetchAllEmployees(
      businessId,
      status,
      Number(page),
      Number(limit)
    )
    return formatResponse(res, response.code, response.message, response.data)
  }

  const updateEmployeeStatus = async (req: Request, res: Response) => {
    const { employeeId } = req.params
    const { status } = req.body
    const response = await EmployeeInteractor().updateEmployeeStatus(
      employeeId,
      status
    )
    return formatResponse(res, response.code, response.message, response.data)
  }

  return { applyForJob, fetchAllEmployees, updateEmployeeStatus }
}
