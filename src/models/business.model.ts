import { BusinessStatus } from '../types/business/business.status.type'
import { BusinessType } from '../types/business/business.type'
import mongoose, { Schema, Document } from 'mongoose'

export interface BusinessDocument extends BusinessType, Document {}

const BusinessSchema = new Schema<BusinessDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    avatar: { type: String, required: true },
    tariffs: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Tariff',
      default: [],
    },
    benefits: { type: [Schema.Types.ObjectId], required: true, ref: 'Benefit' },
    restrictions: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Restriction',
      default: [],
    },
    currentStatus: {
      type: String,
      required: true,
      default: BusinessStatus.ACTIVE,
    },
    policies: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Policy',
      default: [],
    },
    location: { type: String, required: true },
    sector: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    branchCounter: { type: Number, required: true, default: 0 },
    parentBranch: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
    },
    owner: { type: String, required: true, ref: 'User' },
  },
  {
    timestamps: true,
    strict: true,
  }
)

export default mongoose.model<BusinessDocument>('Business', BusinessSchema)
