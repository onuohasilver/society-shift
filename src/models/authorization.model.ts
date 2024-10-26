import mongoose, { Schema, Document } from 'mongoose'
import { Authorization } from '../types/user/authorization.type'

export interface AuthorizationDocument extends Authorization, Document {}

const AuthorizationSchema: Schema = new Schema<AuthorizationDocument>(
  {
    userId: { type: String, required: true },
    pinHash: { type: String, required: true },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
    strict: true,
  }
)

export default mongoose.model<AuthorizationDocument>(
  'Authorization',
  AuthorizationSchema
)
