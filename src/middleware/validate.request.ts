import { Request, Response, NextFunction } from 'express'
import { Messages } from '../data'

/**
 * Defines the structure for validation rules that can be applied to request fields
 */
type ValidationRule = {
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array' // The expected data type
  required?: boolean // Whether the field is mandatory
  minLength?: number // Minimum length for strings
  maxLength?: number // Maximum length for strings
  min?: number // Minimum value for numbers
  max?: number // Maximum value for numbers
  pattern?: RegExp // Regular expression pattern for strings
  enum?: any[] // Array of allowed values
  custom?: (value: any) => boolean | string // Custom validation function
  properties?: {
    // For validating nested object properties
    [key: string]: ValidationRule
  }
  items?: ValidationRule // For validating array items
}

/**
 * Schema defining validation rules for request fields
 */
export type ValidationSchema = {
  [key: string]: ValidationRule
}

/**
 * Middleware factory that creates a validation middleware based on a schema
 * @param schema - Validation schema defining rules for request fields
 * @param target - Target location of validation ('body' | 'params')
 * @returns Express middleware function that validates incoming requests
 */
export const validateRequest = (
  schema: ValidationSchema,
  target: 'body' | 'params' = 'body'
) => {
  const validateField = (
    value: any,
    rules: ValidationRule,
    fieldPath: string
  ): string[] => {
    const errors: string[] = []

    // Check required fields
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${fieldPath} is required`)
      return errors
    }

    // Skip further validation if field is not required and not provided
    if (!rules.required && (value === undefined || value === null)) {
      return errors
    }

    // Type validation - check if value matches specified type
    if (rules.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value
      if (actualType !== rules.type) {
        errors.push(`${fieldPath} must be of type ${rules.type}`)
        return errors
      }
    }

    // String validations - length and pattern checks
    if (rules.type === 'string' && typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(
          `${fieldPath} must be at least ${rules.minLength} characters long`
        )
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(
          `${fieldPath} must be at most ${rules.maxLength} characters long`
        )
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${fieldPath} has invalid format`)
      }
    }

    // Number validations - range checks
    if (rules.type === 'number' && typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(
          `${fieldPath} must be greater than or equal to ${rules.min}`
        )
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`${fieldPath} must be less than or equal to ${rules.max}`)
      }
    }

    // Enum validation - check if value is in allowed list
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${fieldPath} must be one of: ${rules.enum.join(', ')}`)
    }

    // Custom validation - run user-provided validation function
    if (rules.custom) {
      const result = rules.custom(value)
      if (typeof result === 'string') {
        errors.push(result)
      } else if (!result) {
        errors.push(`${fieldPath} failed custom validation`)
      }
    }

    // Object validation - validate nested properties
    if (rules.type === 'object' && rules.properties) {
      Object.entries(rules.properties).forEach(([propName, propRules]) => {
        const propValue = value[propName]
        const propPath = `${fieldPath}.${propName}`
        errors.push(...validateField(propValue, propRules, propPath))
      })
    }

    // Array validation - validate array items
    if (rules.type === 'array' && rules.items && Array.isArray(value)) {
      value.forEach((item, index) => {
        errors.push(
          ...validateField(item, rules.items!, `${fieldPath}[${index}]`)
        )
      })
    }

    return errors
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const data = target === 'body' ? req.body : req.params
    const errors: string[] = []

    // Validate each field in the schema
    Object.entries(schema).forEach(([field, rules]) => {
      errors.push(...validateField(data[field], rules, field))
    })

    // If any validation errors occurred, return 400 with error messages
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      })
    }

    next()
  }
}
