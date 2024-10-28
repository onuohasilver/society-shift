import { Request, Response, NextFunction } from 'express'
import verifyGoogleToken from './verify.google.auth'
import verifyAppleIDToken from './verify.apple.auth'
import formatResponse from '../utilities/format.response'
import { Messages } from '../data/errors'
import { RequestHeaders } from '../data/headers'

/**
 * Middleware to verify social authentication tokens
 * Validates the token from request headers and attaches user details to request body
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Response with error if token invalid/missing, calls next() if valid
 */
async function verifySocialToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract social provider from headers
  const social = req.headers[RequestHeaders.SOCIAL_PROVIDER] as string

  // Return error if no social provider provided
  if (!social) {
    return formatResponse(res, 401, Messages.SOCIAL_PROVIDER_MISSING)
  }

  switch (social.toLowerCase()) {
    case 'google':
      return verifyGoogleToken(req, res, next)
    case 'apple':
      return verifyAppleIDToken(req, res, next)
    default:
      return verifyGoogleToken(req, res, next)
  }
}

export default verifySocialToken
