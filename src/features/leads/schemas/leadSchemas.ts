import { z } from 'zod'
import type { Translations } from '@/i18n'
import { PHONE_PATTERN } from '@/utils/formUtils'
import { MANUAL_ACTIVITY_TYPES, SELECTABLE_LOST_REASONS, type LeadActivityType, type LostReason } from '../types/leadTypes'

const isLostReason = (value: number): value is LostReason => SELECTABLE_LOST_REASONS.some((reason) => reason === value)
const isManualActivity = (value: number): value is LeadActivityType =>
  MANUAL_ACTIVITY_TYPES.some((type) => type === value)

/** Backend `CreateOrUpdateLeadRequest` + `Lead.Create/Update`: ism va telefon `Guard.Text`, bosqich majburiy. */
export function createLeadSchema(t: Translations) {
  return z.object({
    fullName: z.string().trim().min(1, t.common.requiredField),
    phone: z.string().trim().min(1, t.common.requiredField).regex(PHONE_PATTERN, t.common.invalidPhone),
    parentPhone: z
      .string()
      .trim()
      .refine((value) => value === '' || PHONE_PATTERN.test(value), t.common.invalidPhone),
    stageId: z.string().min(1, t.common.requiredField),
    courseId: z.string(),
    sourceId: z.string(),
    note: z.string().trim(),
  })
}

export type LeadFormValues = z.infer<ReturnType<typeof createLeadSchema>>

/** Backend `ConvertLeadRequest(LeadId, GroupId?, JoinedDate?)`: guruh tanlansa qo'shilish sanasi kerak. */
export function createConvertLeadSchema(t: Translations) {
  return z
    .object({
      groupId: z.string(),
      joinedDate: z.string(),
    })
    .superRefine((values, ctx) => {
      if (values.groupId && !values.joinedDate) {
        ctx.addIssue({ code: 'custom', path: ['joinedDate'], message: t.common.requiredField })
      }
    })
}

export type ConvertLeadFormValues = z.infer<ReturnType<typeof createConvertLeadSchema>>

/** Backend `MarkLeadLostRequest`: sabab `Guard.Defined(LostReason)`. */
export function createLostLeadSchema(t: Translations) {
  return z.object({
    reason: z.number().refine((value): boolean => isLostReason(value), t.common.requiredField),
    details: z.string().trim(),
  })
}

export type LostLeadFormValues = z.infer<ReturnType<typeof createLostLeadSchema>>

/** Backend `AddLeadActivityRequest` + `LeadActivity.Create`: tur `Guard.Defined`, izoh `Guard.Text`. */
export function createLeadActivitySchema(t: Translations) {
  return z.object({
    activityType: z.number().refine((value): boolean => isManualActivity(value), t.common.requiredField),
    note: z.string().trim().min(1, t.common.requiredField),
  })
}

export type LeadActivityFormValues = z.infer<ReturnType<typeof createLeadActivitySchema>>
