import { BusinessType } from '../types/business/business.type'
import BusinessModel, { BusinessDocument } from '../models/business.model'
import { dataResponse } from '../utilities/format.response'
import { Messages, StatusCodes } from '../data'
import {
  returnIfNotDeleted,
  updateIfFound,
  returnAndPaginate,
  skipPreProcess,
  saveAndReturn,
} from '../utilities/mongoose'

export const BusinessInteractor = () => {
  const createBusiness = async (businessData: Partial<BusinessType>) => {
    return saveAndReturn<BusinessDocument>({
      model: BusinessModel,
      data: businessData,
      successMessage: Messages.BUSINESS_CREATED,
      preProcess: skipPreProcess,
    })
  }

  const getBusinessById = async (id: string) => {
    return returnIfNotDeleted<BusinessDocument>({
      model: BusinessModel,
      id,
      notFoundMessage: Messages.BUSINESS_NOT_FOUND,
      deletedMessage: Messages.BUSINESS_ALREADY_DELETED,
    })
  }

  const updateBusiness = async (
    id: string,
    businessData: Partial<BusinessType>
  ) => {
    return updateIfFound<BusinessDocument>({
      model: BusinessModel,
      id,
      updateData: businessData,
      updatedMessage: Messages.BUSINESS_UPDATED,
      notFoundMessage: Messages.BUSINESS_NOT_FOUND,
      deletedMessage: Messages.BUSINESS_ALREADY_DELETED,
    })
  }

  const createNewBranch = async (id: string, location: string) => {
    return saveAndReturn<BusinessDocument>({
      model: BusinessModel,
      data: { location },
      successMessage: Messages.BRANCH_CREATED,
      preProcess: async (data) => {
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
        business.branchCounter += 1
        await business.save()
        return { shouldProceed: true, result: business }
      },
      updateBeforeSave: (newBranch) => {
        const business = newBranch
        Object.assign(newBranch, business.toObject(), {
          parentBranch: business._id,
          location: location,
        })
        delete newBranch._id
      },
    })
  }

  const fetchAllBusinessBranches = async (
    id: string,
    page: number = 1,
    limit: number = 10
  ) => {
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
