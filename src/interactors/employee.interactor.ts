import { EmployeeType } from '../types/employees/employees.types'
import { dataResponse } from '../utilities/format.response'
import { Messages, StatusCodes } from '../data'
import EmployeeModel, { EmployeeDocument } from '../models/employee.model'
import { returnAndPaginate, updateIfFound } from '../utilities/mongoose'
import { saveAndReturn } from '../utilities/mongoose/save.and.return'

export const EmployeeInteractor = () => {
  /**
   * Creates a new employee application record in the database
   *
   * @param {Partial<EmployeeType>} employeeData - The employee application data to create
   * @returns {Promise<{ message: string, data: EmployeeDocument | null, code: number }>} Response containing the created employee or error
   *
   * @description
   * This function performs the following steps:
   * 1. Takes partial employee data as input
   * 2. Sets the initial status to 'applied'
   * 3. Saves the employee application to the database
   * 4. Returns the newly created employee record with success message
   */
  const applyForJob = async (
    employeeData: Partial<EmployeeType>
  ): Promise<{
    message: string
    data: EmployeeDocument | null
    code: number
  }> => {
    return saveAndReturn<EmployeeDocument>({
      model: EmployeeModel,
      data: employeeData,
      successMessage: Messages.EMPLOYEE_CREATED,
      updateBeforeSave: (employee) => {
        employee.currentStatus = 'applied'
      },
    })
  }

  /**
   * Fetches all employees for a business filtered by status with pagination
   *
   * @param {string} businessId - The ID of the business to fetch employees for
   * @param {string} status - The employment status to filter by (e.g. 'applied', 'hired')
   * @param {number} page - The page number for pagination
   * @param {number} limit - The number of results per page
   * @returns {Promise<{ message: string, data: { docs: EmployeeDocument[], totalDocs: number, page: number }, code: number }>} Response containing paginated employees or error
   *
   * @description
   * This function performs the following steps:
   * 1. Takes business ID, status, and pagination parameters as input
   * 2. Queries employees matching the business ID and status
   * 3. Returns paginated results with employee documents
   */
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
      foundMessage: Messages.EMPLOYEES_FOUND,
    })
  }

  /**
   * Updates the status of an employee in the database
   *
   * @param {string} employeeId - The ID of the employee to update
   * @param {string} status - The new status to set for the employee
   * @returns {Promise<{ message: string, data: EmployeeDocument | null, code: number }>} Response containing the updated employee or error
   *
   * @description
   * This function performs the following steps:
   * 1. Verifies the employee exists and is not deleted
   * 2. Updates the employee's currentStatus with the provided status
   * 3. Returns the updated employee document
   */
  const updateEmployeeStatus = async (employeeId: string, status: string) => {
    return updateIfFound<EmployeeDocument>({
      model: EmployeeModel,
      id: employeeId,
      updateData: {
        currentStatus: status,
      },
      updatedMessage: Messages.EMPLOYEE_UPDATED,
    })
  }

  return { applyForJob, fetchAllEmployees, updateEmployeeStatus }
}
