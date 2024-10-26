import { Request, Response, NextFunction } from 'express'
import formatResponse from '../utilities/format.response'
import { verifyAppleToken } from '../services/auth/apple.verifier.service'
import { ErrorMessages } from '../data/errors'
import { RequestHeaders } from '../data/headers'

async function verifyAppleIDToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers[RequestHeaders.SOCIAL_TOKEN] as string

  if (!token) {
    return formatResponse(res, 400, ErrorMessages.TOKEN_MISSING)
  }

  try {
    const jwtClaims = await verifyAppleToken({
      idToken: token,
      clientId: 'com.board.clashes',
    })
    console.log(jwtClaims, 'jwtClaims')
    req.body.sub = jwtClaims.sub
    req.body.email = jwtClaims.email

    console.log(req.body)
    return next()
  } catch (error) {
    console.log(error, 'token errors')
    return formatResponse(res, 401, ErrorMessages.TOKEN_INVALID, error)
  }
}

export default verifyAppleIDToken
