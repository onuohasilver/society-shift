import { generateToken } from '../services/auth/create.token.service'
import UserModel, { UserDocument } from '../models/user.model'
import { UserType } from '../types/user/user.type'
import { generateWordReferralCode } from '../utilities/referral.code.gen'
import { dataResponse } from '../utilities/format.response'
import { Messages, StatusCodes } from '../data'
import { AuthorizationInteractor } from './authorization.interactor'
import { returnIfNotDeleted } from '../utilities/mongoose/return.if.deleted'
import { updateIfFound } from '../utilities/mongoose/update.if.found'

const { createAuthorization } = AuthorizationInteractor()

export const UserInteractor = () => {
  //1. Create a user
  //2. Generate a token
  //3. Save the token to the user
  //4. Generate a referral code
  //5. Save the referral code to the user
  const createUser = async (userData: UserType) => {
    try {
      const existingUser = await UserModel.findOne({ subId: userData.subId })
      if (existingUser) {
        return dataResponse(
          Messages.USER_ALREADY_EXISTS,
          existingUser,
          StatusCodes.SUCCESS
        )
      }
      let user = new UserModel(userData)

      const referralCode = generateWordReferralCode()
      await createAuthorization(user._id as string)
      user.referralCode = referralCode
      await user.save()
      return dataResponse(Messages.USER_CREATED, user, StatusCodes.CREATED)
    } catch (error) {
      return dataResponse(
        Messages.INTERNAL_SERVER_ERROR,
        error,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  const getUserById = async (userId: string) => {
    return returnIfNotDeleted<UserDocument>(
      UserModel,
      userId,
      Messages.USER_NOT_FOUND,
      Messages.USER_ALREADY_DELETED
    )
  }

  const updateUser = async (userId: string, userData: Partial<UserType>) => {
    if (Object.keys(userData).length === 1) {
      return dataResponse(
        Messages.USER_UPDATE_DATA_MISSING,
        null,
        StatusCodes.BAD_REQUEST
      )
    }
    return updateIfFound<UserDocument>(
      UserModel,
      userId,
      userData,
      Messages.USER_UPDATED,
      Messages.USER_NOT_FOUND,
      Messages.USER_ALREADY_DELETED
    )
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
