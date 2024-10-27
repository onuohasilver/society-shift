import { Model, Document } from 'mongoose'
import { dataResponse } from '../format.response'
import { Messages, StatusCodes } from '../../data'

/**
 * Saves a new document to the database and returns the saved document.
 *
 * @template T - The type of the document, extending Mongoose's Document interface.
 * @param {Model<T>} model - The Mongoose model to save the document to.
 * @param {Partial<T>} data - The data to save as a new document.
 * @param {(data: Partial<T>) => Promise<{ shouldProceed: boolean, result?: any }>} [preProcess] - Optional function to perform pre-processing and potentially return early.
 * @param {(document: T) => void} [updateBeforeSave] - Optional function to update the document before saving.
 * @param {string} [successMessage=Messages.CREATED] - The message to return on successful save.
 * @returns {Promise<{ message: string, data: T | null, code: number }>} A promise that resolves to an object containing the response message, saved document, and status code.
 *
 * @throws {Error} If there's an internal server error during the save process.
 *
 * @description
 * This function performs the following steps:
 * 1. If provided, calls the preProcess function for potential early return.
 * 2. Creates a new document instance with the provided data.
 * 3. If provided, calls the updateBeforeSave function to modify the document.
 * 4. Attempts to save the document to the database.
 * 5. If successful, returns the saved document with a success message.
 * 6. If an error occurs during the process, returns an internal server error response.
 */
export const saveAndReturn = async <T extends Document>(
  {
    model,
    data,
    successMessage = Messages.CREATED,
    preProcess,
    updateBeforeSave,
  }: {
    model: Model<T>;
    data: Partial<T>;
    successMessage?: string;
    preProcess: (data: Partial<T>) => Promise<{ shouldProceed: boolean; result?: any }>;
    updateBeforeSave?: (document: T) => void;
  }
) => {
  try {
    if (preProcess) {
      const { shouldProceed, result } = await preProcess(data)
      if (!shouldProceed) {
        return result
      }
    }

    const document = new model(data)
    if (updateBeforeSave) {
      updateBeforeSave(document)
    }
    const savedDocument = await document.save()
    return dataResponse(successMessage, savedDocument, StatusCodes.CREATED)
  } catch (error) {
    return dataResponse(
      Messages.INTERNAL_SERVER_ERROR,
      error,
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

export const skipPreProcess = async () => ({ shouldProceed: true })
export const skipUpdateBeforeSave = (document: Document) => {}
