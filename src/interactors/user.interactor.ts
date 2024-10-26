import { generateToken } from '../services/auth/create.token.service'
import UserModel from '../models/user.model'
import { UserType } from '../types/user/user.type'
import { generateWordReferralCode } from '../utilities/referral.code.gen'
import { dataResponse } from '../utilities/format.response'

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
        return dataResponse('User already exists', existingUser, 200)
      }
      let user = new UserModel(userData)
      const token = generateToken(user._id as string)
      const referralCode = generateWordReferralCode()
      user.token = token
      user.referralCode = referralCode
      await user.save()
      return dataResponse('User created successfully', user, 201)
    } catch (error) {
      return dataResponse('Internal server error', error, 500)
    }
  }

  return {
    createUser,
  }
}
