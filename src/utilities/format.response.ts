import { Response } from 'express'
import { AppResponseType } from '../types/response.type'

const formatResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any
) => {
  return res.status(status).json({ status, message, data })
}
export default formatResponse

export const dataResponse = (message: string, data: any, code: number) => {
  return { message, data, code }
}
