/** Backend `Zucco.Domain.Courses.Enums` bilan 1:1 (JSON'da raqam sifatida keladi). */
export const COURSE_LEVEL = {
  General: 1,
  Beginner: 2,
  Elementary: 3,
  PreIntermediate: 4,
  Intermediate: 5,
  UpperIntermediate: 6,
  Advanced: 7,
} as const

export type CourseLevel = (typeof COURSE_LEVEL)[keyof typeof COURSE_LEVEL]
export const COURSE_LEVEL_VALUES = Object.values(COURSE_LEVEL)

export const COURSE_STATUS = {
  Active: 1,
  Inactive: 2,
  Archived: 3,
} as const

export type CourseStatus = (typeof COURSE_STATUS)[keyof typeof COURSE_STATUS]
export const COURSE_STATUS_VALUES = Object.values(COURSE_STATUS)

export const COURSES_PAGE_SIZE = 12

export interface CourseListItem {
  id: string
  subjectId: string
  subjectName: string
  name: string
  durationMonths: number
  lessonsPerMonth: number
  lessonDurationMinutes: number
  basePrice: number
  level: CourseLevel
  status: CourseStatus
}

export interface CourseResponse extends CourseListItem {
  description?: string | null
  createdAt: string
}

export interface CourseListFilters {
  page?: number
  pageSize?: number
  subjectId?: string
  status?: CourseStatus
  search?: string
}

export interface SubjectItem {
  id: string
  name: string
  description?: string | null
  courseCount: number
  createdAt: string
}

export interface CreateOrUpdateSubjectRequest {
  id?: string | null
  name: string
  description?: string | null
}

export interface CreateOrUpdateCourseRequest {
  id?: string | null
  subjectId: string
  name: string
  description?: string | null
  durationMonths: number
  lessonsPerMonth: number
  lessonDurationMinutes: number
  basePrice: number
  level: CourseLevel
  status: CourseStatus
}
