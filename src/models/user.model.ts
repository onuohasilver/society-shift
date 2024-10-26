import mongoose, { Schema, Document } from 'mongoose'
import { User } from '../types/user/user.type'

export interface UserDocument extends User, Document {}

const UserSchema: Schema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    subId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    strict: true,
  }
)

export default mongoose.model<UserDocument>('User', UserSchema)
