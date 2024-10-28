import { BusinessType } from '../types/business/business.type'
import BusinessModel, { BusinessDocument } from '../models/business.model'
import { Messages, StatusCodes } from '../data'
import {
  returnIfNotDeleted,
  updateIfFound,
  returnAndPaginate,
  saveAndReturn,
} from '../utilities/mongoose'

export const BusinessInteractor = () => {
  /**
   * Creates a new business record in the database
   *
   * @param {Partial<BusinessType>} businessData - The business data to create
   * @returns {Promise<{ message: string, data: BusinessDocument | null, code: number }>} Response containing the created business or error
   *
   * @descriptioån
   * This function performs the following steps:
   * 1. Takes partial business data as input
   * 2. Saves the business document to the database
   * 3. Returns the newly created business with a success message
   */
  const createBusiness = async (
    businessData: Partial<BusinessType>
  ): Promise<{
    message: string
    data: BusinessDocument | null
    code: number
  }> => {
    // Use utility function to handle saving and response formatting
    return saveAndReturn<BusinessDocument>({
      model: BusinessModel,
      data: businessData,
      successMessage: Messages.BUSINESS_CREATED,
    })
  }

  /**
   * Retrieves a business by its ID along with selected owner information
   *
   * @param {string} id - The ID of the business to retrieve
   * @returns {Promise<{ message: string, data: BusinessDocument | null, code: number }>} Response containing the business or error
   *
   * @description
   * This function performs the following steps:
   * 1. Queries the business by ID and checks if it exists and is not deleted
   * 2. Populates the owner field with selected properties (_id, name, referralCode)
   * 3. Returns the business document with populated owner data
   */
  const getBusinessById = async (
    id: string
  ): Promise<{
    message: string
    data: BusinessDocument | null
    code: number
  }> => {
    // Define fields to select from owner document
    const ownerFields = '_id name referralCode'
    return returnIfNotDeleted<BusinessDocument>({
      model: BusinessModel,
      id,
      notFoundMessage: Messages.BUSINESS_NOT_FOUND,
      deletedMessage: Messages.BUSINESS_ALREADY_DELETED,
      populate: [{ path: 'owner', select: ownerFields, model: 'User' }],
    })
  }

  /**
   * Updates an existing business with new data
   *
   * @param {string} id - The ID of the business to update
   * @param {Partial<BusinessType>} businessData - The new business data to apply
   * @returns {Promise<{ message: string, data: BusinessDocument | null, code: number }>} Response containing the updated business or error
   *
   * @description
   * This function performs the following steps:
   * 1. Verifies the business exists and is not deleted
   * 2. Updates the business with the provided data
   * 3. Returns the updated business document
   */
  const updateBusiness = async (
    id: string,
    businessData: Partial<BusinessType>
  ): Promise<{
    message: string
    data: BusinessDocument | null
    code: number
  }> => {
    // Use utility function to handle update logic including validation
    return updateIfFound<BusinessDocument>({
      model: BusinessModel,
      id,
      updateData: businessData,
      updatedMessage: Messages.BUSINESS_UPDATED,
      notFoundMessage: Messages.BUSINESS_NOT_FOUND,
      deletedMessage: Messages.BUSINESS_ALREADY_DELETED,
    })
  }

  /**
   * Creates a new branch for an existing business
   *
   * @param {string} id - The ID of the parent business
   * @param {string} location - The location of the new branch
   * @returns {Promise<{ message: string, data: BusinessDocument | null, code: number }>} Response containing the created branch or error
   *
   * @description
   * This function performs the following steps:
   * 1. Verifies the parent business exists and is not deleted
   * 2. Increments the branch counter on the parent business
   * 3. Creates a new branch with the parent business's data
   * 4. Updates the branch location and sets the parent reference
   */
  const createNewBranch = async (
    id: string,
    location: string
  ): Promise<{
    message: string
    data: BusinessDocument | null
    code: number
  }> => {
    return saveAndReturn<BusinessDocument>({
      model: BusinessModel,
      data: { location },
      // Check if parent business exists and increment branch counter
      preProcess: async () => {
        const response = await returnIfNotDeleted<BusinessDocument>({
          model: BusinessModel,
          id,
          notFoundMessage: Messages.BUSINESS_NOT_FOUND,
          deletedMessage: Messages.BUSINESS_ALREADY_DELETED,
        })
        if (response.code !== StatusCodes.SUCCESS) {
          return { shouldProceed: false, result: response }
        }
        const business = response.data
        // Increment branch counter on parent business
        business.branchCounter += 1
        await business.save()
        return { shouldProceed: true, result: business }
      },
      // Copy parent business data to new branch and set branch-specific fields
      updateBeforeSave: (newBranch) => {
        const business = newBranch
        Object.assign(newBranch, business.toObject(), {
          parentBranch: business._id, // Set reference to parent business
          location: location, // Set new branch location
        })
        delete newBranch._id // Remove ID to allow MongoDB to generate a new one
      },
      successMessage: Messages.BRANCH_CREATED,
    })
  }

  /**
   * Fetches all branches for a given business with pagination
   *
   * @param {string} id - The ID of the parent business to fetch branches for
   * @param {number} [page=1] - The page number for pagination (defaults to 1)
   * @param {number} [limit=10] - The number of results per page (defaults to 10)
   * @returns {Promise<{ message: string, data: { docs: BusinessDocument[], totalDocs: number, page: number }, code: number }>}
   * Response containing paginated branches or error
   *
   * @description
   * This function performs the following steps:
   * 1. Creates a query to find all branches with matching parent business ID
   * 2. Returns paginated results using the returnAndPaginate utility
   */
  const fetchAllBusinessBranches = async (
    id: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    message: string
    data: { docs: BusinessDocument[]; totalDocs: number; page: number }
    code: number
  }> => {
    // Query to find all branches with this parent business ID
    const query = { parentBranch: id }
    return returnAndPaginate<BusinessDocument>({
      model: BusinessModel,
      query,
      page,
      limit,
      foundMessage: Messages.BRANCHES_FOUND,
    })
  }

  return {
    createBusiness,
    getBusinessById,
    updateBusiness,
    createNewBranch,
    fetchAllBusinessBranches,
  }
}
