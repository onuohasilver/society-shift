import { Response } from 'express'

/**
 * Formats and sends an HTTP response with consistent structure
 *
 * @param res - Express Response object
 * @param status - HTTP status code
 * @param message - Response message
 * @param data - Optional response payload
 * @returns Response with standardized format {status, message, data}
 */
const formatResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any
) => {
  // Return formatted response with status code and JSON body
  return res.status(status).json({ status, message, data })
}
export default formatResponse

/**
 * Creates a standardized data response object
 * Used internally by utility functions to format their responses
 *
 * @param message - Response message
 * @param data - Response payload
 * @param code - Status code
 * @returns Formatted response object {message, data, code}
 */
export const dataResponse = (message: string, data: any, code: number) => {
  return { message, data, code }
}
