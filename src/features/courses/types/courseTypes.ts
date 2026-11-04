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

export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  [COURSE_LEVEL.General]: 'Умумий',
  [COURSE_LEVEL.Beginner]: 'Beginner (A1)',
  [COURSE_LEVEL.Elementary]: 'Elementary (A2)',
  [COURSE_LEVEL.PreIntermediate]: 'Pre-Intermediate (B1)',
  [COURSE_LEVEL.Intermediate]: 'Intermediate (B1+)',
  [COURSE_LEVEL.UpperIntermediate]: 'Upper-Intermediate (B2)',
  [COURSE_LEVEL.Advanced]: 'Advanced (C1)',
}

export const COURSE_STATUS = {
  Active: 1,
  Inactive: 2,
  Archived: 3,
} as const

export type CourseStatus = (typeof COURSE_STATUS)[keyof typeof COURSE_STATUS]

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

export interface SubjectItem {
  id: string
  name: string
  description?: string
  courseCount: number
  createdAt: string
}

export interface CreateCourseRequest {
  id?: string
  subjectId: string
  name: string
  description?: string
  durationMonths: number
  lessonsPerMonth: number
  lessonDurationMinutes: number
  basePrice: number
  level: CourseLevel
  status: CourseStatus
}
