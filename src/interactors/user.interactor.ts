import { generateToken } from '../services/auth/create.token.service'
import UserModel from '../models/user.model'
import { UserType } from '../types/user/user.type'
import { generateWordReferralCode } from '../utilities/referral.code.gen'
import { dataResponse } from '../utilities/format.response'
import { Messages, StatusCodes } from '../data'

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
      const token = generateToken(user._id as string)
      const referralCode = generateWordReferralCode()
      user.token = token
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
    const user = await UserModel.findById(userId)
    return dataResponse(Messages.USER_FOUND, user, StatusCodes.SUCCESS)
  }

  const updateUser = async (userId: string, userData: UserType) => {
    if (Object.keys(userData).length === 1) {
      return dataResponse(
        Messages.USER_UPDATE_DATA_MISSING,
        null,
        StatusCodes.BAD_REQUEST
      )
    }
    const user = await UserModel.findByIdAndUpdate(userId, userData, {
      new: true,
    })
    return dataResponse(Messages.USER_UPDATED, user, StatusCodes.SUCCESS)
  }

  return {
    createUser,
    getUserById,
    updateUser,
  }
}
