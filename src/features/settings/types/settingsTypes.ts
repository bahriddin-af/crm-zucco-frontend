/** Backend `Zucco.Domain.Identity.Enums.StaffRoleType`. */
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

/** Backend `Constants.Security.MinimumPasswordLength` (PasswordPolicy). */
export const PASSWORD_MIN_LENGTH = 12

/** Backend `CurrentUserProfileResponse` (`API_ROUTES.AUTH.ME`). */
export interface CurrentUserProfile {
  userId: string
  fullName: string
  phone: string
  email: string | null
  tenantId: string | null
  branchId: string | null
  roleType: StaffRoleType | null
  roles: string[]
  permissions: string[]
}

/** Backend `ChangePasswordRequest`. */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

/** Backend `RoleDto` (`API_ROUTES.STAFF.ROLES`). */
export interface RoleDto {
  id: string
  name: string
  description: string | null
  permissions: string[]
}
