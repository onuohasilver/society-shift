import { BusinessType } from '../types/business/business.type'
import BusinessModel, { BusinessDocument } from '../models/business.model'
import { dataResponse } from '../utilities/format.response'
import { Messages, StatusCodes } from '../data'
import {
  returnIfNotDeleted,
  updateIfFound,
  returnAndPaginate,
} from '../utilities/mongoose'

export const BusinessInteractor = () => {
  const createBusiness = async (businessData: Partial<BusinessType>) => {
    try {
      const business = new BusinessModel(businessData)
      await business.save()
      return dataResponse(
        Messages.BUSINESS_CREATED,
        business,
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

  const getBusinessById = async (id: string) => {
    return returnIfNotDeleted<BusinessDocument>(
      BusinessModel,
      id,
      Messages.BUSINESS_NOT_FOUND,
      Messages.BUSINESS_ALREADY_DELETED
    )
  }

  const updateBusiness = async (
    id: string,
    businessData: Partial<BusinessType>
  ) => {
    return updateIfFound<BusinessDocument>(
      BusinessModel,
      id,
      businessData,
      Messages.BUSINESS_UPDATED,
      Messages.BUSINESS_NOT_FOUND,
      Messages.BUSINESS_ALREADY_DELETED
    )
  }

  const createNewBranch = async (id: string, location: string) => {
    const response = await returnIfNotDeleted<BusinessDocument>(
      BusinessModel,
      id,
      Messages.BUSINESS_NOT_FOUND,
      Messages.BUSINESS_ALREADY_DELETED
    )
    if (response.code !== StatusCodes.SUCCESS) {
      return response
    }
    try {
      const business = response.data
      business.branchCounter = business.branchCounter + 1
      const newBranchData = {
        ...business.toObject(),
        parentBranch: business._id,
        location: location,
      }
      delete newBranchData._id
      const newBranch = new BusinessModel(newBranchData)
      await newBranch.save()
      await business.save()
      return dataResponse(
        Messages.BRANCH_CREATED,
        newBranch,
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

  const fetchAllBusinessBranches = async (
    id: string,
    page: number = 1,
    limit: number = 10
  ) => {
    const query = { parentBranch: id}
    return returnAndPaginate<BusinessDocument>(
      BusinessModel,
      query,
      page,
      limit,
      Messages.BRANCHES_FOUND
    )
  }

  return {
    createBusiness,
    getBusinessById,
    updateBusiness,
    createNewBranch,
    fetchAllBusinessBranches,
  }
}
