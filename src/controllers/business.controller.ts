import { Request, Response } from 'express'
import { BusinessInteractor } from '../interactors/business.interactor'
import formatResponse from '../utilities/format.response'

export const BusinessController = () => {
  const createBusiness = async (req: Request, res: Response) => {
    const { name, description, avatar, sector, location } = req.body
    const { _id } = req.body.user
    const response = await BusinessInteractor().createBusiness({
      name,
      description,
      avatar,
      owner: _id,
      sector,
      location,
    })
    return formatResponse(res, response.code, response.message, response.data)
  }

  const getBusinessById = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await BusinessInteractor().getBusinessById(id)
    return formatResponse(res, response.code, response.message, response.data)
  }

  const updateBusiness = async (req: Request, res: Response) => {
    const { id } = req.params
    const { body } = req
    const response = await BusinessInteractor().updateBusiness(id, body)
    return formatResponse(res, response.code, response.message, response.data)
  }

  const createNewBranch = async (req: Request, res: Response) => {
    const { id } = req.params
    const { location } = req.body
    const response = await BusinessInteractor().createNewBranch(id, location)
    return formatResponse(res, response.code, response.message, response.data)
  }

  const fetchAllBusinessBranches = async (req: Request, res: Response) => {
    const { id } = req.params
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)
    const response = await BusinessInteractor().fetchAllBusinessBranches(id, page, limit)
    return formatResponse(res, response.code, response.message, response.data)
  }

  return { createBusiness, getBusinessById, updateBusiness, createNewBranch, fetchAllBusinessBranches }
}
