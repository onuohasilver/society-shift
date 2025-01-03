import { Model, Document, PopulateOptions } from 'mongoose'
import { dataResponse } from '../format.response'
import { Messages, StatusCodes } from '../../data'

/**
 * Retrieves a document from the database if it exists and is not marked as deleted.
 *
 * @template T - The type of the document, extending Mongoose's Document interface.
 * @param {Model<T & { isDeleted?: boolean }>} model - The Mongoose model to query.
 * @param {string} id - The unique identifier of the document to retrieve.
 * @param {string} [notFoundMessage=Messages.NOT_FOUND] - The message to return if the document is not found.
 * @param {string} [deletedMessage=Messages.ALREADY_DELETED] - The message to return if the document is marked as deleted.
 * @param {(id: string) => Promise<{ shouldProceed: boolean, result?: any }>} [preProcess] - Optional function to perform pre-processing and potentially return early.
 * @returns {Promise<{ message: string, data: T | null, code: number }>} A promise that resolves to an object containing the response message, retrieved document (if successful), and status code.
 *
 * @throws {Error} If there's an internal server error during the retrieval process.
 *
 * @description
 * This function performs the following steps:
 * 1. If provided, calls the preProcess function for potential early return.
 * 2. Attempts to find the document by its ID.
 * 3. If the document is not found, returns a "not found" response.
 * 4. If the document is marked as deleted, returns an "already deleted" response.
 * 5. If the document exists and is not deleted, returns it with a success message.
 */
export const returnIfNotDeleted = async <T extends Document>({
  model,
  id,
  notFoundMessage = Messages.NOT_FOUND,
  deletedMessage = Messages.ALREADY_DELETED,
  populate,
  preProcess,
}: {
  model: Model<T & { isDeleted?: boolean }>
  id: string
  notFoundMessage?: string
  deletedMessage?: string
  populate?: PopulateOptions | PopulateOptions[]
  preProcess?: (id: string) => Promise<{ shouldProceed: boolean; result?: any }>
}) => {
  try {
    if (preProcess) {
      const { shouldProceed, result } = await preProcess(id)
      if (!shouldProceed) {
        return result
      }
    }

    let query = model.findById(id)

    if (populate) {
      query = query.populate(populate)
    }

    const document = await query.exec()

    if (!document) {
      return dataResponse(notFoundMessage, null, StatusCodes.NOT_FOUND)
    }

    if (document.isDeleted) {
      return dataResponse(deletedMessage, null, StatusCodes.NOT_FOUND)
    }

    return dataResponse(Messages.FOUND, document, StatusCodes.SUCCESS)
  } catch (error) {
    return dataResponse(
      Messages.INTERNAL_SERVER_ERROR,
      error,
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
