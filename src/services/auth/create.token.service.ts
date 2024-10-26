import * as jwt from 'jsonwebtoken'

/**
 * Generates a token for the given user ID.
 * @param userId - The ID of the user.
 * @returns The generated token.
 */
export const generateToken = (userId: string): string => {
  const token = jwt.sign({ _id: userId }, 'shiftsocietysociety')
  return token
}

/**
 * Verifies the authenticity of a token.
 * @param token - The token to be verified.
 */
export const verifyToken = (token: string) => {
  const verification = jwt.verify(token, 'shiftsocietysociety')
  return verification
}
