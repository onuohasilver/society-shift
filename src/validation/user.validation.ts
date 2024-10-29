import { ValidationSchema } from '../middleware/validate.request'

export const createUserSchema: ValidationSchema = {
  name: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: 'string',
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  role: {
    type: 'string',
    required: true,
    enum: ['user', 'admin'], // Add other valid roles as needed
  },
  subId: {
    type: 'string',
    required: true,
  },
  avatar: {
    type: 'string',
    required: false,
  },
}

export const updateUserSchema: ValidationSchema = {
  name: {
    type: 'string',
    required: false,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: 'string',
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  role: {
    type: 'string',
    required: false,
    enum: ['user', 'admin'],
  },
  avatar: {
    type: 'string',
    required: false,
  },
}

export const getUserByIdSchema: ValidationSchema = {
  userId: {
    type: 'string',
    required: true,
    pattern: /^[0-9a-fA-F]{24}$/, // MongoDB ObjectId pattern
  },
}

export const chooseLocationSchema: ValidationSchema = {
  locationId: {
    type: 'string',
    required: true,
  },
}
