import { AuthorizationType } from '../types/user/authorization.type'
import AuthorizationModel from '../models/authorization.model'
import { Messages, StatusCodes } from '../data'
import { dataResponse } from '../utilities/format.response'
import { generateToken } from '../services/auth/create.token.service'

export const AuthorizationInteractor = () => {
  const createAuthorization = async (id: string) => {
    const token = generateToken(id)
    const authorization = new AuthorizationModel({
      userId: id,
      token,
    })
    await authorization.save()
    return dataResponse(
      Messages.AUTHORIZATION_CREATED,
      authorization,
      StatusCodes.CREATED
    )
  }
  return { createAuthorization }
}
