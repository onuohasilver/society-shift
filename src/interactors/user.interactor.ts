import { generateToken } from '../services/auth/create.token.service'
import UserModel, { UserDocument } from '../models/user.model'
import { UserType } from '../types/user/user.type'
import { generateWordReferralCode } from '../utilities/referral.code.gen'
import { dataResponse } from '../utilities/format.response'
import { Messages, StatusCodes } from '../data'
import { AuthorizationInteractor } from './authorization.interactor'
import {
  returnIfNotDeleted,
  saveAndReturn,
  updateIfFound,
} from '../utilities/mongoose'

const { createAuthorization } = AuthorizationInteractor()

export const UserInteractor = () => {
  /**
   * Creates a new user record in the database
   *
   * @param {UserType} userData - The user data to create
   * @returns {Promise<{ message: string, data: UserDocument | null, code: number }>} Response containing the created user or error
   *
   * @description
   * This function performs the following steps:
   * 1. Checks if a user with the provided subId already exists
   * 2. If user exists, returns existing user with success message
   * 3. If user doesn't exist, generates a referral code
   * 4. Creates authorization record for the new user
   * 5. Saves the new user with referral code
   */
  const createUser = async (
    userData: UserType
  ): Promise<{ message: string; data: UserDocument | null; code: number }> => {
    return saveAndReturn<UserDocument>({
      model: UserModel,
      data: userData,
      successMessage: Messages.USER_CREATED,
      // Check if user already exists with this subId
      preProcess: async (data) => {
        const existingUser = await UserModel.findOne({ subId: data.subId })
        if (existingUser) {
          return {
            shouldProceed: false,
            result: dataResponse(
              Messages.USER_ALREADY_EXISTS,
              existingUser,
              StatusCodes.SUCCESS
            ),
          }
        }
        return { shouldProceed: true }
      },
      // Generate referral code and create authorization before saving
      updateBeforeSave: async (user) => {
        const referralCode = generateWordReferralCode()
        await createAuthorization(user._id as string)
        user.referralCode = referralCode
      },
    })
  }

  /**
   * Retrieves a user by their ID if they exist and are not deleted
   *
   * @param {string} userId - The ID of the user to retrieve
   * @returns {Promise<{ message: string, data: UserDocument | null, code: number }>} Response containing the user or error
   *
   * @description
   * This function performs the following steps:
   * 1. Queries the user by ID using the returnIfNotDeleted utility
   * 2. Returns error if user is not found or is deleted
   * 3. Returns the user document with success message if found
   */
  const getUserById = async (
    userId: string
  ): Promise<{ message: string; data: UserDocument | null; code: number }> => {
    return returnIfNotDeleted<UserDocument>({
      model: UserModel,
      id: userId,
      notFoundMessage: Messages.USER_NOT_FOUND,
      deletedMessage: Messages.USER_ALREADY_DELETED,
    })
  }

  /**
   * Updates an existing user's information
   *
   * @param {string} userId - The ID of the user to update
   * @param {Partial<UserType>} userData - The new user data to apply
   * @returns {Promise<{ message: string, data: UserDocument | null, code: number }>} Response containing the updated user or error
   *
   * @description
   * This function performs the following steps:
   * 1. Validates that more than one field is being updated
   * 2. Verifies the user exists and is not deleted
   * 3. Updates the user with the provided data
   * 4. Returns the updated user document
   */
  const updateUser = async (
    userId: string,
    userData: Partial<UserType>
  ): Promise<{ message: string; data: UserDocument | null; code: number }> => {
    // Use utility function to handle update logic including validation
    return updateIfFound<UserDocument>({
      model: UserModel,
      id: userId,
      updateData: userData,
      updatedMessage: Messages.USER_UPDATED,
      notFoundMessage: Messages.USER_NOT_FOUND,
      deletedMessage: Messages.USER_ALREADY_DELETED,
      // Validate that update data contains more than one field
      preProcess: async (data) => {
        if (Object.keys(data).length === 1) {
          return {
            shouldProceed: false,
            result: dataResponse(
              Messages.USER_UPDATE_DATA_MISSING,
              null,
              StatusCodes.BAD_REQUEST
            ),
          }
        }

        return { shouldProceed: true }
      },
    })
  }

  /**
   * Marks a user as deleted in the system
   *
   * @param {string} userId - The ID of the user to delete
   * @returns {Promise<{ message: string, data: UserDocument | null, code: number }>} Response containing the deleted user or error
   *
   * @description
   * This function performs the following steps:
   * 1. Updates the user's isDeleted flag to true using updateUser
   * 2. Returns success response with the deleted user
   */
  const deleteUser = async (
    userId: string
  ): Promise<{ message: string; data: UserDocument | null; code: number }> => {
    // Soft delete the user by setting isDeleted flag
    const user = await updateUser(userId, { isDeleted: true })

    // Return success response
    return dataResponse(Messages.USER_DELETED, user, StatusCodes.SUCCESS)
  }

  return {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
  }
}
