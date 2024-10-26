import { Request, Response, NextFunction } from 'express'
import formatResponse from '../utilities/format.response'
import { verifyAppleToken } from '../services/auth/apple.verifier.service'

async function verifyAppleIDToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['x-social-token'] as string

  if (!token) {
    return formatResponse(
      {
        status: 'error',
        message: 'Token is missing',
        data: { error: 'token is missing' },
      },
      res
    )
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
    return formatResponse(
      {
        status: 'error',
        message: 'Failed to get token',
        data: { error: (error as Error).message },
      },
      res
    )
  }
}

export default verifyAppleIDToken
