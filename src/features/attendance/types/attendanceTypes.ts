/** Backend `Zucco.Domain.Attendance.Enums` bilan 1:1 (JSON'da raqam sifatida keladi). */
export const ATTENDANCE_STATUS = {
  Present: 1,
  Excused: 2,
  Unexcused: 3,
  Late: 4,
} as const

export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS]
/** UI'dagi tugmalar tartibi. */
export const ATTENDANCE_STATUS_ORDER: readonly AttendanceStatus[] = [
  ATTENDANCE_STATUS.Present,
  ATTENDANCE_STATUS.Late,
  ATTENDANCE_STATUS.Excused,
  ATTENDANCE_STATUS.Unexcused,
]

export const HOMEWORK_STATUS = {
  Completed: 1,
  Partial: 2,
  NotDone: 3,
  Excused: 4,
} as const

export type HomeworkStatus = (typeof HOMEWORK_STATUS)[keyof typeof HOMEWORK_STATUS]
export const HOMEWORK_STATUS_VALUES = Object.values(HOMEWORK_STATUS)

/** Backend `Constants.Academic.MaximumScore`. */
export const MAX_SCORE = 100

export type { LessonItem } from '@/features/groups/types/groupTypes'

export interface StudentAttendanceSheetItem {
  studentId: string
  studentName: string
  phone: string
  status?: AttendanceStatus | null
  score?: number | null
  homeworkStatus?: HomeworkStatus | null
  comment?: string | null
}

export interface LessonAttendanceSheetResponse {
  lessonId: string
  groupId: string
  groupName: string
  lessonDate: string
  startTime: string
  endTime: string
  lessonNumber: number
  topic?: string | null
  isMarked: boolean
  students: StudentAttendanceSheetItem[]
}

/** Backend `MarkStudentAttendanceItem`. `score` faqat `attendance.grade` ruxsati bilan yuboriladi. */
export interface MarkStudentAttendanceItem {
  studentId: string
  status: AttendanceStatus
  score?: number | null
  homeworkStatus: HomeworkStatus
  comment?: string | null
}

/** Backend `MarkLessonAttendanceRequest` (`API_ROUTES.ATTENDANCE.MARK`). */
export interface MarkLessonAttendanceRequest {
  lessonId: string
  students: MarkStudentAttendanceItem[]
  topic?: string | null
}
