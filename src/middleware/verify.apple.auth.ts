import { Request, Response, NextFunction } from 'express'
import formatResponse from '../utilities/format.response'
import { verifyAppleToken } from '../services/auth/apple.verifier.service'
import { Messages } from '../data/errors'
import { RequestHeaders } from '../data/headers'

/**
 * Middleware to verify Apple ID tokens and extract user information
 * Validates the token from request headers and attaches user sub and email to request body
 *
 * @param req - Express request object containing Apple ID token in headers
 * @param res - Express response object
 * @param next - Express next function
 * @returns Response with error if token invalid/missing, calls next() if valid
 */
async function verifyAppleIDToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract Apple ID token from headers
  const token = req.headers[RequestHeaders.SOCIAL_TOKEN] as string

  // Return error if no token provided
  if (!token) {
    return formatResponse(res, 400, Messages.TOKEN_MISSING)
  }

  try {
    // Verify token and extract claims
    const jwtClaims = await verifyAppleToken({
      idToken: token,
      clientId: 'com.board.clashes',
    })

    // Attach user sub and email from claims to request body
    req.body.sub = jwtClaims.sub
    req.body.email = jwtClaims.email

    return next()
  } catch (error) {
    return formatResponse(res, 401, Messages.TOKEN_INVALID, error)
  }
}

export default verifyAppleIDToken
