import { EmployeeType } from '../types/employees/employees.types'
import { Schema, model, Document } from 'mongoose'

export interface EmployeeDocument extends EmployeeType, Document {}

const employeeSchema = new Schema<EmployeeDocument>(
  {
    owner: { type: String, required: true, ref: 'User' },
    businessId: { type: String, required: true, ref: 'Business' },
    role: { type: String, required: true },
    currentStatus: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: true,
  }
)

export default model<EmployeeDocument>('Employee', employeeSchema)
