import { Request, Response } from 'express'
import { UserInteractor } from '../interactors/user.interactor'
import { UserType } from '../types/user/user.type'
import formatResponse from '../utilities/format.response'

export const UserController = () => {
  const createUser = async (req: Request, res: Response) => {
    const userData = req.body as UserType
    const response = await UserInteractor().createUser(userData)
    return formatResponse(res, response.code, response.message, response.data)
  }

  const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.userId
    const response = await UserInteractor().getUserById(userId)
    return formatResponse(res, response.code, response.message, response.data)
  }

  const updateUser = async (req: Request, res: Response) => {
    const userId = req.body.user._id
    const userData = req.body as UserType
    const response = await UserInteractor().updateUser(userId, userData)
    return formatResponse(res, response.code, response.message, response.data)
  }

  return {
    createUser,
    getUserById,
    updateUser,
  }
}
