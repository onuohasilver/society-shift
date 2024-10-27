import { EmployeeType } from '../types/employees/employees.types'
import { dataResponse } from '../utilities/format.response'
import { Messages, StatusCodes } from '../data'
import EmployeeModel, { EmployeeDocument } from '../models/employee.model'
import { returnAndPaginate, updateIfFound } from '../utilities/mongoose'
import {
  saveAndReturn,
  skipPreProcess,
} from '../utilities/mongoose/save.and.return'

export const EmployeeInteractor = () => {
  const applyForJob = async (employeeData: Partial<EmployeeType>) => {
    return saveAndReturn<EmployeeDocument>({
      model: EmployeeModel,
      data: employeeData,
      successMessage: Messages.EMPLOYEE_CREATED,
      preProcess: skipPreProcess,
      updateBeforeSave: (employee) => {
        employee.currentStatus = 'applied'
      },
    })
  }

  const fetchAllEmployees = async (
    businessId: string,
    status: string,
    page: number,
    limit: number
  ) => {
    return returnAndPaginate<EmployeeDocument>({
      model: EmployeeModel,
      query: { businessId, currentStatus: status },
      page,
      limit,
      foundMessage: Messages.EMPLOYEES_FOUND
    })
  }

  const updateEmployeeStatus = async (employeeId: string, status: string) => {
    return updateIfFound<EmployeeDocument>({
      model: EmployeeModel,
      id: employeeId,
      updateData: {
        currentStatus: status,
      },
      updatedMessage: Messages.EMPLOYEE_UPDATED
    })
  }

  return { applyForJob, fetchAllEmployees, updateEmployeeStatus }
}
