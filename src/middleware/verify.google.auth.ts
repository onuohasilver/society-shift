import { Request, Response, NextFunction } from 'express'
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library'
import formatResponse from '../utilities/format.response'
import { ErrorMessages } from '../data/errors'
import { RequestHeaders } from '../data/headers'
import { runOrMock } from '../utilities/run.or.mock'
import { mockGoogleTokenPayload } from '../data/mocks/mock.google.token.payload'

const client = new OAuth2Client()
async function verifyGoogleToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers[RequestHeaders.SOCIAL_TOKEN] as string
  if (!token) {
    return formatResponse(res, 400, ErrorMessages.TOKEN_MISSING)
  }

  const tokenPayload = await runOrMock(async () => {
    const ticket = await client
      .verifyIdToken({
        idToken: token,
        audience:
          '221900142607-kuvff9428irl1loop402q31dsj0i1d8q.apps.googleusercontent.com',
      })
      .catch(() => {
        return formatResponse(res, 400, ErrorMessages.TOKEN_INVALID)
      })
    return (ticket as LoginTicket).getPayload() as TokenPayload
  }, mockGoogleTokenPayload as TokenPayload)
  console.log(tokenPayload)
  req.body.subId = tokenPayload.sub as string
  req.body.email = tokenPayload.email as string
  req.body.name = tokenPayload.name as string
  req.body.socialChannel = 'google'

  return next()
}

export default verifyGoogleToken
