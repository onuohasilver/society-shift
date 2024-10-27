import { EmployeeType } from '../types/employees/employees.types'
import { dataResponse } from '../utilities/format.response'
import { Messages, StatusCodes } from '../data'
import EmployeeModel, { EmployeeDocument } from '../models/employee.model'
import { returnAndPaginate, updateIfFound } from '../utilities/mongoose'

export const EmployeeInteractor = () => {
  const applyForJob = async (employeeData: Partial<EmployeeType>) => {
    try {
      const employee = new EmployeeModel(employeeData)
      employee.currentStatus = 'applied'
      await employee.save()
      return dataResponse(
        Messages.EMPLOYEE_CREATED,
        employee,
        StatusCodes.CREATED
      )
    } catch (error) {
      return dataResponse(
        Messages.INTERNAL_SERVER_ERROR,
        error,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  const fetchAllEmployees = async (
    businessId: string,
    status: string,
    page: number,
    limit: number
  ) => {
    return returnAndPaginate<EmployeeDocument>(
      EmployeeModel,
      { businessId, currentStatus: status },
      page,
      limit
    )
  }

  const updateEmployeeStatus = async (employeeId: string, status: string) => {
    return updateIfFound<EmployeeDocument>(EmployeeModel, employeeId, {
      currentStatus: status,
    })
  }

  return { applyForJob, fetchAllEmployees, updateEmployeeStatus }
}
