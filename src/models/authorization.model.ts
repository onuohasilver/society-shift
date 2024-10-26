import mongoose, { Schema, Document } from 'mongoose'
import { AuthorizationType } from '../types/user/authorization.type'

export interface AuthorizationDocument extends AuthorizationType, Document {}

const AuthorizationSchema: Schema = new Schema<AuthorizationDocument>(
  {
    userId: { type: String, required: true },
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
