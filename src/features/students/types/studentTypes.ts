export const STUDENT_STATUS = {
  ACTIVE: 'Active',
  FROZEN: 'Frozen',
  DEPARTED: 'Departed',
} as const

export type StudentStatus = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS]

export interface StudentGroupEnrollment {
  id: string
  groupId: string
  groupName: string
  courseName: string
  joinedDate: string
  customPrice?: number
  standardPrice: number
  status: 'Active' | 'Frozen' | 'Departed'
}

export interface Student {
  id: string
  fullName: string
  phone: string
  code: string // Masalan: ZU-0248
  status: StudentStatus
  balance: number // So'mda (manfiy bo'lsa qarzdorlik)
  coins: number
  branchId: string
  branchName: string
  enrollments: StudentGroupEnrollment[]
  parentPhone?: string
  notes?: string
  freezeInfo?: {
    startDate: string
    endDate: string
    reason: string
  }
}

export interface FreezeStudentRequest {
  studentId: string
  startDate: string
  endDate: string
  reason: string
}

export interface EnrollStudentRequest {
  studentId: string
  groupId: string
  joinedDate: string
  customPrice?: number
}
