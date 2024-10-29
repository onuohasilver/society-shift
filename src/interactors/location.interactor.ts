import { saveAndReturn } from '../utilities/mongoose/save.and.return'
import LocationModel, { LocationDocument } from '../models/location.model'
import { Location } from '../types/locations/location.type'
import { Messages } from '../data'
import { returnAndPaginate } from '../utilities/mongoose/return.and.paginate'
import { updateIfFound } from '../utilities/mongoose/update.if.found'
import { UpdateQuery } from 'mongoose'
import { returnIfNotDeleted } from '../utilities/mongoose'

export const LocationInteractor = () => {
  const createLocation = async (locationData: Location) => {
    return await saveAndReturn<LocationDocument>({
      model: LocationModel,
      data: locationData,
      successMessage: Messages.LOCATION_CREATED,
    })
  }
  const getLocations = async (page?: number, limit?: number) => {
    return await returnAndPaginate<LocationDocument>({
      model: LocationModel,
      query: {},
      page,
      limit,
      foundMessage: Messages.FOUND,
    })
  }

  const updateLocation = async (
    id: string,
    locationData: Partial<Location>
  ) => {
    return await updateIfFound<LocationDocument>({
      model: LocationModel,
      id,
      updateData: locationData,
      updatedMessage: Messages.LOCATION_UPDATED,
      notFoundMessage: Messages.LOCATION_NOT_FOUND,
      deletedMessage: Messages.LOCATION_ALREADY_DELETED,
    })
  }

  const getLocationById = async (id: string) => {
    return await returnIfNotDeleted<LocationDocument>({
      model: LocationModel,
      id,
      notFoundMessage: Messages.LOCATION_NOT_FOUND,
      deletedMessage: Messages.LOCATION_ALREADY_DELETED,
    })
  }

  return {
    createLocation,
    getLocations,
    updateLocation,
    getLocationById,
  }
}
