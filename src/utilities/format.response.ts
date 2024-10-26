import { Response } from 'express'
import { AppResponseType } from '../types/response.type'

const formatResponse = (result: AppResponseType, res: Response) => {
  if (result.status === 'success') {
    return res.status(201).json(result)
  } else {
    return res.status(400).json(result)
  }
}
export default formatResponse
