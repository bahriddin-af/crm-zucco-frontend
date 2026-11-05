/** Backend `Zucco.Domain.Identity.Enums.StaffRoleType` (JSON'da raqam). */
export const STAFF_ROLE_TYPE = {
  CEO: 1,
  BranchManager: 2,
  Teacher: 3,
  AssistantTeacher: 4,
  Cashier: 5,
  SalesManager: 6,
  Support: 7,
} as const

export type StaffRoleType = (typeof STAFF_ROLE_TYPE)[keyof typeof STAFF_ROLE_TYPE]
export const STAFF_ROLE_TYPE_VALUES: readonly StaffRoleType[] = Object.values(STAFF_ROLE_TYPE)

/** Backend `UserStatus`. */
export const USER_STATUS = {
  Active: 1,
  Inactive: 2,
  Suspended: 3,
} as const

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]
export const USER_STATUS_VALUES: readonly UserStatus[] = Object.values(USER_STATUS)

/** Backend `PasswordPolicy` (`SecurityConstants.MinimumPasswordLength`). */
export const MIN_PASSWORD_LENGTH = 12

export interface StaffListItem {
  id: string
  fullName: string
  phone: string
  status: UserStatus
  primaryBranchId?: string | null
  branchName?: string | null
  roleType: StaffRoleType
  specialization?: string | null
  roles: string[]
}

/** Backend `StaffResponse`. */
export interface StaffDetail extends StaffListItem {
  email?: string | null
  hireDate: string
  bio?: string | null
  telegramUsername?: string | null
  createdAt: string
}

/** Backend `RoleDto` (`GET /api/staff/roles`). */
export interface StaffRoleDto {
  id: string
  name: string
  description?: string | null
  permissions: string[]
}

export interface CreateOrUpdateStaffRequest {
  id?: string | null
  fullName: string
  phone: string
  email?: string | null
  /** Yangi xodim uchun majburiy, tahrirlashda bo'sh bo'lsa o'zgarmaydi. */
  password?: string | null
  primaryBranchId?: string | null
  roleType: StaffRoleType
  specialization?: string | null
  hireDate: string
  bio?: string | null
  telegramUsername?: string | null
  /** `null` bo'lsa backend rollarni o'zgartirmaydi (`staff.roles_manage` talab qilinmaydi). */
  roleIds?: string[] | null
  status: UserStatus
}
