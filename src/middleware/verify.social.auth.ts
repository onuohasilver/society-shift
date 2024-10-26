import { Request, Response, NextFunction } from 'express'
import verifyGoogleToken from './verify.google.auth'
import verifyAppleIDToken from './verify.apple.auth'
import formatResponse from '../utilities/format.response'
import { Messages } from '../data/errors'
import { RequestHeaders } from '../data/headers'
async function verifySocialToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const social = req.headers[RequestHeaders.SOCIAL_PROVIDER] as string

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
