import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import UserModel from '../models/user.model'
import formatResponse from '../utilities/format.response'
import { verifyToken } from '../services/auth/create.token.service'

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the access token from the request headers or query parameters
  const accessToken = req.headers.authorization?.split(' ')[1]

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' })
  }

  //Find a user with the access token
  let user: any
  try {
    const verifiedUserId = verifyToken(accessToken)
    user = await UserModel.findOne({ _id: (verifiedUserId as JwtPayload)._id })
    if (!user) {
      return formatResponse(res, 401, 'Unauthorized')
    }
    req.body.user = user
    return next()
  } catch (error) {
    return formatResponse(res, 500, 'Error finding user', error)
  }
}
