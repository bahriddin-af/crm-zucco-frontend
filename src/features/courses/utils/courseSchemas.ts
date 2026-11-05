import { z } from 'zod'
import type { Translations } from '@/i18n'
import { hasMoneyPrecision } from '@/utils/money'
import {
  COURSE_LEVEL,
  COURSE_LEVEL_VALUES,
  COURSE_STATUS,
  COURSE_STATUS_VALUES,
  type CourseResponse,
  type CreateOrUpdateCourseRequest,
} from '../types/courseTypes'

/** Backend `CreateOrUpdateCourseRequest` + `Course.Create` (`Guard.Text/Positive/NonNegative/Money/Defined`). */
export function createCourseSchema(t: Translations) {
  const v = t.courses.validation
  const positiveInt = z.number({ error: v.positiveInteger }).int(v.positiveInteger).positive(v.positiveInteger)

  return z.object({
    subjectId: z.string().min(1, v.subjectRequired),
    name: z.string().trim().min(1, v.nameRequired),
    description: z.string(),
    durationMonths: positiveInt,
    lessonsPerMonth: positiveInt,
    lessonDurationMinutes: positiveInt,
    basePrice: z
      .number({ error: v.priceInvalid })
      .min(0, v.priceInvalid)
      .refine((value) => hasMoneyPrecision(value), v.priceInvalid),
    level: z.literal(COURSE_LEVEL_VALUES, { error: v.optionInvalid }),
    status: z.literal(COURSE_STATUS_VALUES, { error: v.optionInvalid }),
  })
}

export type CourseFormValues = z.infer<ReturnType<typeof createCourseSchema>>

/** Backend `Course` entity standart qiymatlari. */
export const COURSE_FORM_DEFAULTS: CourseFormValues = {
  subjectId: '',
  name: '',
  description: '',
  durationMonths: 1,
  lessonsPerMonth: 12,
  lessonDurationMinutes: 90,
  basePrice: 0,
  level: COURSE_LEVEL.General,
  status: COURSE_STATUS.Active,
}

export function courseToFormValues(course: CourseResponse): CourseFormValues {
  return {
    subjectId: course.subjectId,
    name: course.name,
    description: course.description ?? '',
    durationMonths: course.durationMonths,
    lessonsPerMonth: course.lessonsPerMonth,
    lessonDurationMinutes: course.lessonDurationMinutes,
    basePrice: course.basePrice,
    level: course.level,
    status: course.status,
  }
}

export function toCourseRequest(values: CourseFormValues, id?: string | null): CreateOrUpdateCourseRequest {
  const description = values.description.trim()
  return {
    id: id ?? null,
    subjectId: values.subjectId,
    name: values.name.trim(),
    description: description === '' ? null : description,
    durationMonths: values.durationMonths,
    lessonsPerMonth: values.lessonsPerMonth,
    lessonDurationMinutes: values.lessonDurationMinutes,
    basePrice: values.basePrice,
    level: values.level,
    status: values.status,
  }
}

/** Backend `CreateOrUpdateSubjectRequest` + `Subject.Create` (`Guard.Text(name)`). */
export function createSubjectSchema(t: Translations) {
  return z.object({
    name: z.string().trim().min(1, t.courses.validation.nameRequired),
    description: z.string(),
  })
}

export type SubjectFormValues = z.infer<ReturnType<typeof createSubjectSchema>>
