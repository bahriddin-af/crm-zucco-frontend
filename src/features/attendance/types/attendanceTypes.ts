export const ATTENDANCE_STATUS = {
  Present: 1, // Keldi
  Excused: 2, // Sababli
  Unexcused: 3, // Sababsiz
  Late: 4, // Kechikdi
} as const

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS]

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  [ATTENDANCE_STATUS.Present]: 'Келди',
  [ATTENDANCE_STATUS.Excused]: 'Сабабли',
  [ATTENDANCE_STATUS.Unexcused]: 'Келмади',
  [ATTENDANCE_STATUS.Late]: 'Кечикди',
}

export const HOMEWORK_STATUS = {
  Completed: 1, // Bajarildi
  Partial: 2, // Qisman
  NotDone: 3, // Bajarilmadi
  Excused: 4, // Sababli
} as const

export type HomeworkStatus =
  (typeof HOMEWORK_STATUS)[keyof typeof HOMEWORK_STATUS]

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

export interface LessonItem {
  id: string
  groupId: string
  teacherId: string
  roomId: string
  lessonDate: string
  startTime: string
  endTime: string
  lessonNumber: number
  topic?: string | null
  status: number
  cancellationReason?: string | null
}

export interface MarkStudentAttendanceItem {
  studentId: string
  status: AttendanceStatus
  score?: number | null
  homeworkStatus?: HomeworkStatus
  comment?: string | null
}

export interface MarkLessonAttendanceRequest {
  lessonId: string
  students: MarkStudentAttendanceItem[]
  topic?: string | null
}
