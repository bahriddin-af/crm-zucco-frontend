export const STUDENT_STATUS = {
  Active: 1,
  Trial: 2,
  Frozen: 3,
  Debtor: 4,
  Completed: 5,
  Dropped: 6,
} as const

export type StudentStatus = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS]

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  [STUDENT_STATUS.Active]: 'Фаол',
  [STUDENT_STATUS.Trial]: 'Синов муддатида',
  [STUDENT_STATUS.Frozen]: 'Музлатилган',
  [STUDENT_STATUS.Debtor]: 'Қарздор',
  [STUDENT_STATUS.Completed]: 'Битирган',
  [STUDENT_STATUS.Dropped]: 'Тарк этган',
}

export const GENDER = {
  Male: 1,
  Female: 2,
} as const

export type Gender = (typeof GENDER)[keyof typeof GENDER]

export const PARENT_RELATIONSHIP = {
  Father: 1,
  Mother: 2,
  Guardian: 3,
  Other: 4,
} as const

export type ParentRelationship =
  (typeof PARENT_RELATIONSHIP)[keyof typeof PARENT_RELATIONSHIP]

export interface StudentListItem {
  id: string
  fullName: string
  phone: string
  status: StudentStatus
  balance: number
  coinsBalance: number
  primaryGroup?: string | null
  createdAt: string
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

export interface CreateOrUpdateStudentRequest {
  id?: string
  fullName: string
  phone: string
  birthDate?: string | null
  gender?: Gender
  address?: string | null
  note?: string | null
  status?: StudentStatus
  parents?: StudentParentDto[]
}

export interface FreezeStudentRequest {
  studentId: string
  fromDate: string
  toDate: string
  reason?: string | null
}

export interface EnrollStudentRequest {
  groupId: string
  studentId: string
  joinedDate: string
  customPrice?: number
}
