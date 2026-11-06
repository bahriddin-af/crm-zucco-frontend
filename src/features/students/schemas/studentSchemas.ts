import { z } from 'zod'
import { interpolate, type Translations } from '@/i18n'
import { PHONE_PATTERN } from '@/utils/formUtils'
import { todayIsoDate } from '@/utils/dateUtils'
import {
  GENDER_VALUES,
  PARENT_RELATIONSHIP_VALUES,
  STUDENT_PARENT_LIMITS,
  STUDENT_STATUS_VALUES,
} from '../types/studentTypes'

/** Backend `Guard.Money`: 2 kasr xonasigacha manfiy bo'lmagan summa. */
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/

const isOneOf = (values: readonly number[]) => (value: number): boolean => values.includes(value)

/**
 * Backend `StudentParentDto` + `StudentParent.Create` (`Guard.Text` ism/telefon, `Guard.Defined` qarindoshlik)
 * va `StudentParentConfiguration` (ism ≤ 150 belgi; telefon ≤ 25 — `PHONE_PATTERN` 20 belgidan oshirmaydi).
 */
export function createStudentParentSchema(t: Translations) {
  return z.object({
    /** Mavjud yozuv ID'si (faqat ma'lumot uchun: backend ro'yxatni to'liq almashtiradi). */
    id: z.string().nullable(),
    fullName: z
      .string()
      .trim()
      .min(1, t.common.requiredField)
      .max(
        STUDENT_PARENT_LIMITS.FULL_NAME,
        interpolate(t.students.form.nameTooLong, { max: STUDENT_PARENT_LIMITS.FULL_NAME })
      ),
    phone: z.string().trim().min(1, t.common.requiredField).regex(PHONE_PATTERN, t.common.invalidPhone),
    relationship: z.literal(PARENT_RELATIONSHIP_VALUES, { error: t.common.requiredField }),
  })
}

export type StudentParentFormValues = z.infer<ReturnType<typeof createStudentParentSchema>>

/** Backend `CreateOrUpdateStudentRequest` + `Student.Create/Update` (`Guard.Text`, `Guard.Defined`). */
export function createStudentSchema(t: Translations) {
  return z.object({
    parents: z.array(createStudentParentSchema(t)),
    fullName: z.string().trim().min(1, t.common.requiredField),
    phone: z.string().trim().min(1, t.common.requiredField).regex(PHONE_PATTERN, t.common.invalidPhone),
    birthDate: z.string(),
    gender: z.number().refine(isOneOf(GENDER_VALUES), t.common.requiredField),
    status: z.number().refine(isOneOf(STUDENT_STATUS_VALUES), t.common.requiredField),
    address: z.string().trim(),
    note: z.string().trim(),
  })
}

export type StudentFormValues = z.infer<ReturnType<typeof createStudentSchema>>

/** Backend `Student.Freeze`: `until >= from` va `until >= bugun`; sabab ixtiyoriy. */
export function createFreezeSchema(t: Translations) {
  return z
    .object({
      fromDate: z.string().min(1, t.common.requiredField),
      toDate: z.string().min(1, t.common.requiredField),
      reason: z.string().trim(),
    })
    .superRefine((values, ctx) => {
      if (!values.fromDate || !values.toDate) return
      // ISO sanalar (YYYY-MM-DD) leksikografik tartibda solishtiriladi.
      if (values.toDate < values.fromDate) {
        ctx.addIssue({ code: 'custom', path: ['toDate'], message: t.students.freeze.toDateBeforeFrom })
      } else if (values.toDate < todayIsoDate()) {
        ctx.addIssue({ code: 'custom', path: ['toDate'], message: t.students.freeze.toDateInPast })
      }
    })
}

export type FreezeFormValues = z.infer<ReturnType<typeof createFreezeSchema>>

/** Backend `AddStudentToGroupRequest(GroupId, StudentId, JoinedDate, Status, CustomPrice?)`. */
export function createEnrollSchema(t: Translations) {
  return z.object({
    groupId: z.string().min(1, t.common.requiredField),
    joinedDate: z.string().min(1, t.common.requiredField),
    customPrice: z
      .string()
      .trim()
      .refine((value) => value === '' || AMOUNT_PATTERN.test(value), t.common.invalidAmount),
  })
}

export type EnrollFormValues = z.infer<ReturnType<typeof createEnrollSchema>>
