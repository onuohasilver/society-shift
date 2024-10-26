import { Request, Response, NextFunction } from 'express'
import verifyGoogleToken from './verify.google.auth'
import verifyAppleIDToken from './verify.apple.auth'
import formatResponse from '../utilities/format.response'

async function verifySocialToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const social = req.headers['x-social-provider'] as string

  if (!social) {
    return formatResponse(
      {
        status: 'error',
        message: 'Social provider is missing',
        data: { error: 'Social provider is missing' },
      },
      res
    )
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
