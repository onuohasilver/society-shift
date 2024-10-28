/**
 * Service for verifying Apple ID tokens and managing Apple JWT keys
 * Provides functionality to validate Apple Sign In tokens and retrieve public keys
 */

import { JwtHeader } from 'jsonwebtoken'
import * as jwt from 'jsonwebtoken'
import * as jwksClient from 'jwks-rsa'
import {
  VerifyAppleIdTokenParams,
  VerifyAppleIdTokenResponse,
} from '../../types/auth/apple.verifier.types'

export const APPLE_BASE_URL = 'https://appleid.apple.com'
export const JWKS_APPLE_URI = '/auth/keys'

/**
 * Retrieves the JSON Web Key (JWK) from Apple's JWKS endpoint for a given key ID
 * @param kid - The key ID to retrieve
 * @returns Promise containing the public key, key ID and algorithm
 */
export const getAppleJWK = async (kid: string) => {
  const client = jwksClient({
    cache: true,
    jwksUri: `${APPLE_BASE_URL}${JWKS_APPLE_URI}`,
  })
  const key = await new Promise<jwksClient.SigningKey>((resolve, reject) => {
    client.getSigningKey(kid, (error, result) => {
      if (error) {
        return reject(error)
      }
      return resolve(result as jwksClient.SigningKey)
    })
  })
  return {
    publicKey: key.getPublicKey(),
    kid: key.kid,
    alg: key.alg,
  }
}

/**
 * Gets the public key from Apple's JWKS for a given key ID
 * @param kid - The key ID to retrieve the public key for
 * @returns Promise containing the public key
 */
export const getApplePublicKey = async (kid: string) => {
  const jwk = await getAppleJWK(kid)

  return jwk.publicKey
}

/**
 * Verifies an Apple ID token for authenticity and validity
 * Checks the token signature, algorithm, issuer, audience and nonce
 * @param params - Object containing idToken, nonce and clientId
 * @returns Promise containing the verified token claims
 * @throws Error if verification fails for any reason
 */
export const verifyAppleToken = async (params: VerifyAppleIdTokenParams) => {
  const decoded = jwt.decode(params.idToken, { complete: true })
  const { kid, alg: jwtAlg } = decoded?.header as JwtHeader

  const { publicKey, alg: jwkAlg } = await getAppleJWK(kid as string)

  if (jwtAlg !== jwkAlg) {
    throw new Error(
      `The alg does not match the jwk configuration - alg: ${jwtAlg} | expected: ${jwkAlg}`
    )
  }

  const jwtClaims = jwt.verify(params.idToken, publicKey, {
    algorithms: [jwkAlg as jwt.Algorithm],
    nonce: params.nonce,
  }) as VerifyAppleIdTokenResponse

  if (jwtClaims?.iss !== APPLE_BASE_URL) {
    throw new Error(
      `The iss does not match the Apple URL - iss: ${jwtClaims.iss} | expected: ${APPLE_BASE_URL}`
    )
  }

  const isFounded = []
    .concat([jwtClaims.aud] as never[])
    .some((aud) => [].concat([params.clientId] as never[]).includes(aud))

  if (isFounded) {
    ;['email_verified', 'is_private_email'].forEach((field) => {
      if (jwtClaims[field] !== undefined) {
        jwtClaims[field] = Boolean(jwtClaims[field])
      }
    })

    return jwtClaims
  }

  throw new Error(
    `The aud parameter does not include this client - is: ${jwtClaims.aud} | expected: ${params.clientId}`
  )
}
