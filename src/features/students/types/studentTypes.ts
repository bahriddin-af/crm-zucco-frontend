/** Backend `Zucco.Domain.Students.Enums` bilan 1:1 (JSON'da raqam sifatida keladi). */
export const STUDENT_STATUS = {
  Active: 1,
  Trial: 2,
  Frozen: 3,
  Debtor: 4,
  Completed: 5,
  Dropped: 6,
} as const

export type StudentStatus = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS]
export const STUDENT_STATUS_VALUES: readonly StudentStatus[] = Object.values(STUDENT_STATUS)

export const GENDER = {
  Male: 1,
  Female: 2,
} as const

export type Gender = (typeof GENDER)[keyof typeof GENDER]
export const GENDER_VALUES: readonly Gender[] = Object.values(GENDER)

export const PARENT_RELATIONSHIP = {
  Father: 1,
  Mother: 2,
  Guardian: 3,
  Other: 4,
} as const

export type ParentRelationship = (typeof PARENT_RELATIONSHIP)[keyof typeof PARENT_RELATIONSHIP]
export const PARENT_RELATIONSHIP_VALUES: readonly ParentRelationship[] = Object.values(PARENT_RELATIONSHIP)

/** Backend `StudentParentConfiguration` ustun chegaralari. */
export const STUDENT_PARENT_LIMITS = {
  FULL_NAME: 150,
} as const

export interface StudentListItem {
  id: string
  fullName: string
  phone: string
  status: StudentStatus
  balance: number
  coinsBalance: number
  primaryGroup?: StudentPrimaryGroup | null
  createdAt: string
}

/**
 * Backend `StudentPrimaryGroup`: eng yangi Active/Trial enrollment (filial bo'yicha filtrlangan ro'yxatda —
 * shu filial ichidagisi). Joriy enrollment bo'lmasa `null`.
 */
export interface StudentPrimaryGroup {
  groupId: string
  groupName: string
  branchId: string
  branchName: string
}

export interface StudentParentDto {
  id?: string | null
  fullName: string
  phone: string
  relationship: ParentRelationship
}

export interface EnrolledGroupInfo {
  groupId: string
  groupName: string
  courseName: string
  teacherName: string
  joinedDate: string
  customPrice?: number | null
}

/** Backend `StudentResponse`. */
export interface StudentDetail {
  id: string
  fullName: string
  phone: string
  birthDate?: string | null
  gender: Gender
  address?: string | null
  photoUrl?: string | null
  status: StudentStatus
  balance: number
  coinsBalance: number
  note?: string | null
  parents: StudentParentDto[]
  enrolledGroups: EnrolledGroupInfo[]
  createdAt: string
}

/** `type` (interface emas): query key `Record<string, unknown>` sifatida qabul qilishi uchun. */
export type StudentListFilters = {
  page?: number
  pageSize?: number
  status?: StudentStatus
  groupId?: string
  /** Shu filialda joriy enrollment'i bor talabalar. Filialga bog'langan xodim boshqa filialni so'rasa — 403. */
  branchId?: string
  search?: string
}

export interface CreateOrUpdateStudentRequest {
  id?: string | null
  fullName: string
  phone: string
  birthDate?: string | null
  gender?: Gender
  address?: string | null
  note?: string | null
  status?: StudentStatus
  /** `null`/yo'q bo'lsa backend ota-onalarni o'zgartirmaydi. */
  parents?: StudentParentDto[] | null
}

export interface FreezeStudentRequest {
  studentId: string
  fromDate: string
  toDate: string
  reason?: string | null
}

/** Backend `AddStudentToGroupRequest` (`POST /api/groups/{id}/students`). */
export interface EnrollStudentRequest {
  groupId: string
  studentId: string
  joinedDate: string
  customPrice?: number | null
}
