import { Request, Response } from 'express'
import { LocationInteractor } from '../interactors/location.interactor'
import formatResponse from '../utilities/format.response'

export const LocationController = () => {
  const createLocation = async (req: Request, res: Response) => {
    const locationData = req.body
    const response = await LocationInteractor().createLocation(locationData)
    return formatResponse(res, response.code, response.message, response.data)
  }

  const getLocations = async (req: Request, res: Response) => {
    const { page, limit } = req.query
    const response = await LocationInteractor().getLocations(
      Number(page),
      Number(limit)
    )
    return formatResponse(res, response.code, response.message, response.data)
  }

  const updateLocation = async (req: Request, res: Response) => {
    const { id } = req.params
    const locationData = req.body
    const response = await LocationInteractor().updateLocation(id, locationData)
    return formatResponse(res, response.code, response.message, response.data)
  }

  return {
    createLocation,
    getLocations,
    updateLocation,
  }
}
