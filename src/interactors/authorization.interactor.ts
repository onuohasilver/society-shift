import { AuthorizationType } from '../types/user/authorization.type'
import AuthorizationModel from '../models/authorization.model'
import { Messages, StatusCodes } from '../data'
import { dataResponse } from '../utilities/format.response'
import { generateToken } from '../services/auth/create.token.service'

/**
 * Authorization interactor that handles authorization-related operations
 * @returns Object containing authorization methods
 */
export const AuthorizationInteractor = () => {
  /**
   * Creates a new authorization record for a user
   * @param id - The user ID to create authorization for
   * @returns Response containing the created authorization details
   */
  const createAuthorization = async (id: string) => {
    // Generate JWT token for the user
    const token = generateToken(id)

    // Create new authorization record
    const authorization = new AuthorizationModel({
      userId: id,
      token,
    })

    // Save authorization to database
    await authorization.save()

    // Return success response with authorization details
    return dataResponse(
      Messages.AUTHORIZATION_CREATED,
      authorization,
      StatusCodes.CREATED
    )
  }

  return { createAuthorization }
}
