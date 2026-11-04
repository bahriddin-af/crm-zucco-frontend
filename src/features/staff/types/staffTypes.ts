export const STAFF_ROLE_TYPE = {
  CEO: 1,
  BranchManager: 2,
  Teacher: 3,
  AssistantTeacher: 4,
  Cashier: 5,
  SalesManager: 6,
  Support: 7,
} as const

export type StaffRoleType =
  (typeof STAFF_ROLE_TYPE)[keyof typeof STAFF_ROLE_TYPE]

export const STAFF_ROLE_LABELS: Record<StaffRoleType, string> = {
  [STAFF_ROLE_TYPE.CEO]: 'Бош директор (CEO)',
  [STAFF_ROLE_TYPE.BranchManager]: 'Филиал мудири',
  [STAFF_ROLE_TYPE.Teacher]: 'Ўқитувчи',
  [STAFF_ROLE_TYPE.AssistantTeacher]: 'Ёрдамчи ўқитувчи',
  [STAFF_ROLE_TYPE.Cashier]: 'Кассир',
  [STAFF_ROLE_TYPE.SalesManager]: 'Администратор (Sales)',
  [STAFF_ROLE_TYPE.Support]: 'Техник ходим',
}

export interface StaffListItem {
  id: string
  fullName: string
  phone: string
  status: number
  primaryBranchId?: string | null
  branchName?: string | null
  roleType: StaffRoleType
  specialization?: string | null
  roles: string[]
}

export interface StaffDetail {
  id: string
  fullName: string
  phone: string
  email?: string | null
  status: number
  primaryBranchId?: string | null
  branchName?: string | null
  roleType: StaffRoleType
  specialization?: string | null
  hireDate: string
  bio?: string | null
  roles: string[]
}

export interface CreateOrUpdateStaffRequest {
  id?: string | null
  fullName: string
  phone: string
  email?: string | null
  password?: string | null
  primaryBranchId?: string | null
  roleType: StaffRoleType
  specialization?: string | null
  hireDate: string
  bio?: string | null
}
