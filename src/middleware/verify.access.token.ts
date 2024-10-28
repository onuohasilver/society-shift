import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import UserModel from '../models/user.model'
import formatResponse from '../utilities/format.response'
import { verifyToken } from '../services/auth/create.token.service'

/**
 * Middleware to verify access tokens and authenticate users
 * Extracts the access token from request headers, verifies it, and attaches the user to the request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Response with error if token invalid/missing, calls next() if valid
 */
export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract bearer token from Authorization header
  const accessToken = req.headers.authorization?.split(' ')[1]

  // Return error if no token provided
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' })
  }

  let user: any
  try {
    // Verify token and extract user ID
    const verifiedUserId = verifyToken(accessToken)

    // Look up user in database
    user = await UserModel.findOne({ _id: (verifiedUserId as JwtPayload)._id })

    // Return unauthorized if user not found
    if (!user) {
      return formatResponse(res, 401, 'Unauthorized')
    }

    // Attach user to request body and continue
    req.body.user = user
    return next()
  } catch (error) {
    // Handle any errors during verification/lookup
    return formatResponse(res, 500, 'Error finding user', error)
  }
}
