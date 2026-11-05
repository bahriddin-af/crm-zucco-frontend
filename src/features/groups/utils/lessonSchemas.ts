import { z } from 'zod'
import { interpolate, type Translations } from '@/i18n'
import { ISO_DATE_PATTERN } from '@/utils/dateUtils'
import { MAX_GENERATED_LESSONS } from '../types/groupTypes'

/** Backend `GenerateGroupScheduleRequest`: 1..MaximumGeneratedLessons, ixtiyoriy boshlanish sanasi. */
export function createGenerateScheduleSchema(t: Translations) {
  const message = interpolate(t.groups.validation.totalLessonsInvalid, { max: MAX_GENERATED_LESSONS })
  return z.object({
    totalLessons: z.number({ error: message }).int(message).min(1, message).max(MAX_GENERATED_LESSONS, message),
    startFromDate: z.string().refine((value) => value === '' || ISO_DATE_PATTERN.test(value), t.groups.validation.startDateRequired),
  })
}

export type GenerateScheduleFormValues = z.infer<ReturnType<typeof createGenerateScheduleSchema>>

/** Backend `Lesson.Cancel` → `Guard.Text(reason)`: bo'sh bo'lmagan matn. */
export function createCancelLessonSchema(t: Translations) {
  return z.object({
    reason: z.string().trim().min(1, t.groups.validation.reasonRequired),
  })
}

export type CancelLessonFormValues = z.infer<ReturnType<typeof createCancelLessonSchema>>
