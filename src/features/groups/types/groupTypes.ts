/** Backend `Zucco.Domain.Groups.Enums` bilan 1:1 (JSON'da raqam sifatida keladi). */
export const DAY_SCHEDULE_TYPE = {
  OddDays: 1,
  EvenDays: 2,
  Everyday: 3,
  Custom: 4,
} as const

export type DayScheduleType = (typeof DAY_SCHEDULE_TYPE)[keyof typeof DAY_SCHEDULE_TYPE]
export const DAY_SCHEDULE_VALUES = Object.values(DAY_SCHEDULE_TYPE)

/** .NET `DayOfWeek`: 0 = Yakshanba ... 6 = Shanba. */
export const DAY_OF_WEEK = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
} as const

export type DayOfWeek = (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK]
/** Hafta dushanbadan boshlanadigan tartib (UI uchun). */
export const WEEK_ORDER: readonly DayOfWeek[] = [
  DAY_OF_WEEK.Monday,
  DAY_OF_WEEK.Tuesday,
  DAY_OF_WEEK.Wednesday,
  DAY_OF_WEEK.Thursday,
  DAY_OF_WEEK.Friday,
  DAY_OF_WEEK.Saturday,
  DAY_OF_WEEK.Sunday,
]

export const GROUP_STATUS = {
  Recruiting: 1,
  Active: 2,
  Frozen: 3,
  Completed: 4,
} as const

export type GroupStatus = (typeof GROUP_STATUS)[keyof typeof GROUP_STATUS]
export const GROUP_STATUS_VALUES = Object.values(GROUP_STATUS)

export const GROUP_STUDENT_STATUS = {
  Active: 1,
  Trial: 2,
  Frozen: 3,
  Left: 4,
  Completed: 5,
} as const

export type GroupStudentStatus = (typeof GROUP_STUDENT_STATUS)[keyof typeof GROUP_STUDENT_STATUS]
export const GROUP_STUDENT_STATUS_VALUES = Object.values(GROUP_STUDENT_STATUS)

export const LESSON_STATUS = {
  Scheduled: 1,
  InProgress: 2,
  Completed: 3,
  Cancelled: 4,
  Rescheduled: 5,
} as const

export type LessonStatus = (typeof LESSON_STATUS)[keyof typeof LESSON_STATUS]

export const BILLING_MODE = {
  MonthlyCalendar: 1,
  CycleBased: 2,
  PerLesson: 3,
  FullCourse: 4,
} as const

export type BillingMode = (typeof BILLING_MODE)[keyof typeof BILLING_MODE]
export const BILLING_MODE_VALUES = Object.values(BILLING_MODE)

export const GROUPS_PAGE_SIZE = 12
/** Backend `Constants.Billing.MaximumGeneratedLessons`. */
export const MAX_GENERATED_LESSONS = 366
export const DEFAULT_GENERATED_LESSONS = 12
export interface GroupListItem {
  id: string
  name: string
  courseId: string
  courseName: string
  teacherId: string
  teacherName: string
  branchId: string
  branchName: string
  roomId: string
  roomName: string
  daysSchedule: DayScheduleType
  startTime: string
  endTime: string
  monthlyPrice: number
  capacity: number
  enrolledStudentsCount: number
  status: GroupStatus
  customDays?: DayOfWeek[] | null
}

export interface GroupResponse extends GroupListItem {
  startDate: string
  endDate?: string | null
  billingMode: BillingMode
  createdAt: string
}

export interface GroupListFilters {
  page?: number
  pageSize?: number
  status?: GroupStatus
  courseId?: string
  teacherId?: string
  branchId?: string
  search?: string
}

export interface CreateOrUpdateGroupRequest {
  id?: string | null
  name: string
  courseId: string
  teacherId: string
  branchId: string
  roomId: string
  startDate: string
  daysSchedule: DayScheduleType
  startTime: string
  endTime: string
  monthlyPrice: number
  capacity: number
  billingMode: BillingMode
  endDate?: string | null
  status: GroupStatus
  customDays?: DayOfWeek[] | null
}

export interface ChangeStudentGroupStatusRequest {
  status: GroupStudentStatus
  leftDate?: string | null
}

export interface GenerateGroupScheduleRequest {
  totalLessons: number
  startFromDate?: string | null
}

/** Backend `LessonResponse`. */
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
  status: LessonStatus
  cancellationReason?: string | null
}

/** Backend `ScheduleLessonResponse` (`API_ROUTES.GROUPS.SCHEDULE`). */
export interface ScheduleLessonResponse {
  id: string
  groupId: string
  groupName: string
  teacherId: string
  teacherName: string
  roomId: string
  roomName: string
  lessonDate: string
  startTime: string
  endTime: string
  status: LessonStatus
}

export interface ScheduleQuery {
  from: string
  to: string
  branchId?: string
  teacherId?: string
  roomId?: string
}

/** Backend `RoomListItem`. */
export interface RoomOption {
  id: string
  branchId: string
  branchName: string
  name: string
  capacity: number
}

