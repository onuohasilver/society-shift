import { Request, Response, NextFunction } from 'express'
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library'
import formatResponse from '../utilities/format.response'
import { Messages } from '../data/errors'
import { RequestHeaders } from '../data/headers'
import { runOrMock } from '../utilities/run.or.mock'
import { mockGoogleTokenPayload } from '../data/mocks/mock.google.token.payload'

const client = new OAuth2Client()

/**
 * Middleware to verify Google ID tokens and extract user information
 * Validates the token from request headers and attaches user details to request body
 *
 * @param req - Express request object containing Google ID token in headers
 * @param res - Express response object
 * @param next - Express next function
 * @returns Response with error if token invalid/missing, calls next() if valid
 */
async function verifyGoogleToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract Google ID token from headers
  const token = req.headers[RequestHeaders.SOCIAL_TOKEN] as string
  if (!token) {
    return formatResponse(res, 400, Messages.TOKEN_MISSING)
  }

  // Verify token and get payload, using mock data in test environment
  const tokenPayload = await runOrMock(async () => {
    const ticket = await client
      .verifyIdToken({
        idToken: token,
        audience:
          '221900142607-kuvff9428irl1loop402q31dsj0i1d8q.apps.googleusercontent.com',
      })
      .catch(() => {
        return formatResponse(res, 400, Messages.TOKEN_INVALID)
      })
    return (ticket as LoginTicket).getPayload() as TokenPayload
  }, mockGoogleTokenPayload as TokenPayload)

  // Attach user details from token payload to request body
  req.body.subId = tokenPayload.sub as string
  req.body.email = tokenPayload.email as string
  req.body.name = tokenPayload.name as string
  req.body.socialChannel = 'google'

  return next()
}

export default verifyGoogleToken
