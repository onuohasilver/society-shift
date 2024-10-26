export interface UserType {
  name: string
  email: string
  pin: string
  role: string
  subId?: string
  token?: string
  referralCode?: string
  createdAt: Date
  updatedAt: Date
}
