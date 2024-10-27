import { Model, Document } from 'mongoose'
import { dataResponse } from '../format.response'
import { Messages, StatusCodes } from '../../data'

/**
 * Retrieves paginated documents from the database based on a query.
 *
 * @template T - The type of the document, extending Mongoose's Document interface.
 * @param {Model<T>} model - The Mongoose model to query.
 * @param {object} query - The query to filter the documents.
 * @param {number} [page=1] - The page number to retrieve.
 * @param {number} [limit=10] - The number of documents per page.
 * @param {string} [foundMessage=Messages.FOUND] - The message to return on successful retrieval.
 * @param {(query: object) => Promise<{ shouldProceed: boolean, result?: any }>} [preProcess] - Optional function to perform pre-processing and potentially return early.
 * @returns {Promise<{ message: string, data: { items: T[], currentPage: number, totalPages: number, totalCount: number, limit: number }, code: number }>} A promise that resolves to an object containing the response message, paginated data, and status code.
 *
 * @throws {Error} If there's an internal server error during the retrieval process.
 *
 * @description
 * This function performs the following steps:
 * 1. If provided, calls the preProcess function for potential early return.
 * 2. Calculates the number of documents to skip based on the page and limit.
 * 3. Retrieves the specified page of documents from the database.
 * 4. Counts the total number of documents matching the query.
 * 5. Calculates the total number of pages.
 * 6. Returns the paginated data with metadata.
 */
export const returnAndPaginate = async <T extends Document>({
  model,
  query,
  page = 1,
  limit = 10,
  foundMessage = Messages.FOUND,
  preProcess,
}: {
  model: Model<T>
  query: object
  page?: number
  limit?: number
  foundMessage?: string
  preProcess?: (
    query: object
  ) => Promise<{ shouldProceed: boolean; result?: any }>
}) => {
  try {
    if (preProcess) {
      const { shouldProceed, result } = await preProcess(query)
      if (!shouldProceed) {
        return result
      }
    }

    const skip = (page - 1) * limit
    const updatedQuery = { ...query, isDeleted: { $ne: true } }

    const items = await model.find(updatedQuery).skip(skip).limit(limit).exec()

    const totalCount = await model.countDocuments(updatedQuery)
    const totalPages = Math.ceil(totalCount / limit)
    const isLastPage = page >= totalPages

    return dataResponse(
      foundMessage,
      {
        items,
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        isLastPage,
      },
      StatusCodes.SUCCESS
    )
  } catch (error) {
    return dataResponse(
      Messages.INTERNAL_SERVER_ERROR,
      error,
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
