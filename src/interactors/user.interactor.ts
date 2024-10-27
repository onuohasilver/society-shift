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
  //1. Create a user
  //2. Generate a token
  //3. Save the token to the user
  //4. Generate a referral code
  //5. Save the referral code to the user
  const createUser = async (userData: UserType) => {
    return saveAndReturn<UserDocument>({
      model: UserModel,
      data: userData,
      successMessage: Messages.USER_CREATED,
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
      updateBeforeSave: async (user) => {
        const referralCode = generateWordReferralCode()
        await createAuthorization(user._id as string)
        user.referralCode = referralCode
      },
    })
  }

  const getUserById = async (userId: string) => {
    return returnIfNotDeleted<UserDocument>({
      model: UserModel,
      id: userId,
      notFoundMessage: Messages.USER_NOT_FOUND,
      deletedMessage: Messages.USER_ALREADY_DELETED,
    })
  }

  const updateUser = async (userId: string, userData: Partial<UserType>) => {
    return updateIfFound<UserDocument>({
      model: UserModel,
      id: userId,
      updateData: userData,
      updatedMessage: Messages.USER_UPDATED,
      notFoundMessage: Messages.USER_NOT_FOUND,
      deletedMessage: Messages.USER_ALREADY_DELETED,
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

  const deleteUser = async (userId: string) => {
    const user = await updateUser(userId, { isDeleted: true })
    return dataResponse(Messages.USER_DELETED, user, StatusCodes.SUCCESS)
  }

  return {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
  }
}
