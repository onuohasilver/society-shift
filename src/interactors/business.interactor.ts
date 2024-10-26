import { BusinessType } from '../types/business/business.type'
import BusinessModel, { BusinessDocument } from '../models/business.model'
import { dataResponse } from '../utilities/format.response'
import { Messages, StatusCodes } from '../data'
import { returnIfNotDeleted } from '../utilities/mongoose/return.if.deleted'
import { updateIfFound } from '../utilities/mongoose/update.if.found'
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
    return returnIfNotDeleted(
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

  return { createBusiness, getBusinessById, updateBusiness }
}
