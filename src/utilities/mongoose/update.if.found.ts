import { Model, Document, UpdateQuery } from 'mongoose'
import { dataResponse } from '../format.response'
import { Messages, StatusCodes } from '../../data'

/**
 * Updates a document in the database if it exists and is not marked as deleted.
 *
 * @template T - The type of the document, extending Mongoose's Document interface.
 * @param {Model<T & { isDeleted?: boolean }>} model - The Mongoose model to query.
 * @param {string} id - The unique identifier of the document to update.
 * @param {Partial<T>} updateData - The data to update the document with.
 * @param {string} [updatedMessage=Messages.FOUND] - The message to return on successful update.
 * @param {string} [notFoundMessage=Messages.NOT_FOUND] - The message to return if the document is not found.
 * @param {string} [deletedMessage=Messages.ALREADY_DELETED] - The message to return if the document is marked as deleted.
 * @param {(data: Partial<T>) => Promise<{ shouldProceed: boolean, result?: any }>} [preProcess] - Optional function to perform pre-processing and potentially return early.
 * @returns {Promise<{ message: string, data: T | null, code: number }>} A promise that resolves to an object containing the response message, updated document (if successful), and status code.
 *
 * @throws {Error} If there's an internal server error during the update process.
 *
 * @description
 * This function performs the following steps:
 * 1. If provided, calls the preProcess function for potential early return.
 * 2. Attempts to find the document by its ID.
 * 3. If the document is not found, returns a "not found" response.
 * 4. If the document is marked as deleted, returns an "already deleted" response.
 * 5. If the document exists and is not deleted, updates it with the provided data.
 * 6. Returns the updated document with a success message.
 * 7. If any error occurs during the process, returns an internal server error response.
 */
export const updateIfFound = async <T extends Document>({
  model,
  id,
  updateData,
  updatedMessage = Messages.FOUND,
  notFoundMessage = Messages.NOT_FOUND,
  deletedMessage = Messages.ALREADY_DELETED,
  preProcess,
}: {
  model: Model<T & { isDeleted?: boolean }>
  id: string
  updateData: Partial<T>
  updatedMessage?: string
  notFoundMessage?: string
  deletedMessage?: string
  preProcess?: (
    data: Partial<T>,
    document: T | null
  ) => Promise<{ shouldProceed: boolean; result?: any }>
}) => {
  try {
    const document = await model.findById(id)
    if (preProcess) {
      const { shouldProceed, result } = await preProcess(updateData, document)
      if (!shouldProceed) {
        return result
      }
    }

    if (!document) {
      return dataResponse(notFoundMessage, null, StatusCodes.NOT_FOUND)
    }

    if (document.isDeleted) {
      return dataResponse(deletedMessage, null, StatusCodes.NOT_FOUND)
    }

    const updatedDocument = await model.findByIdAndUpdate(
      id,
      updateData as UpdateQuery<T>,
      {
        new: true,
      }
    )

    return dataResponse(updatedMessage, updatedDocument, StatusCodes.SUCCESS)
  } catch (error) {
    return dataResponse(
      Messages.INTERNAL_SERVER_ERROR,
      error,
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
