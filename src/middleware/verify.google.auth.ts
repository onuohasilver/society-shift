import { Request, Response, NextFunction } from 'express'
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library'
import formatResponse from '../utilities/format.response'

const client = new OAuth2Client()
async function verifyGoogleToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['x-access-token'] as string

  if (!token) {
    return formatResponse(res, 400, 'Token is Missing')
  }
  const ticket = await client
    .verifyIdToken({
      idToken: token,
      audience:
        '221900142607-kuvff9428irl1loop402q31dsj0i1d8q.apps.googleusercontent.com',
    })
    .catch((error) => {
      console.log(error, 'token errors')
      return formatResponse(res, 400, 'Token was wrong')
    })
  const tokenPayload: TokenPayload = (
    ticket as LoginTicket
  ).getPayload() as TokenPayload
  req.body.subId = tokenPayload.sub as string
  req.body.email = tokenPayload.email as string
  req.body.name = tokenPayload.name as string
  req.body.socialChannel = 'google'

  return next()
}

export default verifyGoogleToken
