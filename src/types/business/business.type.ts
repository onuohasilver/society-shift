import { Schema } from 'mongoose'
import { BusinessStatus } from './business.status.type'
import { BusinessSector } from './business.sector.type'

export interface BusinessType {
  name: string
  description: string
  avatar: string
  tariffs: Schema.Types.ObjectId[]
  benefits: Schema.Types.ObjectId[]
  restrictions: Schema.Types.ObjectId[]
  currentStatus: BusinessStatus
  policies: Schema.Types.ObjectId[]
  isDeleted: boolean
  sector: BusinessSector
  branchCounter: number
  location: string
  owner: Schema.Types.ObjectId
}
