import { z } from 'zod'
import type { Translations } from '@/i18n'
import {
  BILLING_MODE,
  BILLING_MODE_VALUES,
  DAY_OF_WEEK,
  DAY_SCHEDULE_TYPE,
  DAY_SCHEDULE_VALUES,
  GROUP_STATUS,
  GROUP_STATUS_VALUES,
  type CreateOrUpdateGroupRequest,
  type GroupResponse,
} from '../types/groupTypes'
import { ISO_DATE_PATTERN, SHORT_TIME_PATTERN, shortTime, toApiTime } from '@/utils/dateUtils'
import { hasMoneyPrecision } from '@/utils/money'

const DAY_OF_WEEK_VALUES = Object.values(DAY_OF_WEEK)

export const GROUP_FORM_DEFAULTS = {
  startTime: '14:00',
  endTime: '15:30',
  /** Backend `CreateOrUpdateGroupRequest.Capacity` standart qiymati. */
  capacity: 15,
} as const

/** Backend `CreateOrUpdateGroupRequest` + `ScheduleDays.Validate/Resolve` + `Group.Create` qoidalari. */
export function createGroupSchema(t: Translations) {
  const v = t.groups.validation

  return z
    .object({
      name: z.string().trim().min(1, v.nameRequired),
      courseId: z.string().min(1, v.courseRequired),
      branchId: z.string().min(1, v.branchRequired),
      teacherId: z.string().min(1, v.teacherRequired),
      roomId: z.string().min(1, v.roomRequired),
      startDate: z.string().regex(ISO_DATE_PATTERN, v.startDateRequired),
      endDate: z.string(),
      daysSchedule: z.literal(DAY_SCHEDULE_VALUES, { error: v.optionInvalid }),
      customDays: z.array(z.literal(DAY_OF_WEEK_VALUES)),
      startTime: z.string().regex(SHORT_TIME_PATTERN, v.timeRequired),
      endTime: z.string().regex(SHORT_TIME_PATTERN, v.timeRequired),
      monthlyPrice: z
        .number({ error: v.priceInvalid })
        .min(0, v.priceInvalid)
        .refine((value) => hasMoneyPrecision(value), v.priceInvalid),
      capacity: z.number({ error: v.capacityInvalid }).int(v.capacityInvalid).positive(v.capacityInvalid),
      billingMode: z.literal(BILLING_MODE_VALUES, { error: v.optionInvalid }),
      status: z.literal(GROUP_STATUS_VALUES, { error: v.optionInvalid }),
    })
    .superRefine((values, ctx) => {
      if (values.daysSchedule === DAY_SCHEDULE_TYPE.Custom && values.customDays.length === 0) {
        ctx.addIssue({ code: 'custom', path: ['customDays'], message: v.customDaysRequired })
      }
      if (values.endTime <= values.startTime) {
        ctx.addIssue({ code: 'custom', path: ['endTime'], message: v.endTimeAfterStart })
      }
      if (values.endDate !== '' && (!ISO_DATE_PATTERN.test(values.endDate) || values.endDate < values.startDate)) {
        ctx.addIssue({ code: 'custom', path: ['endDate'], message: v.endDateBeforeStart })
      }
    })
}

export type GroupFormValues = z.infer<ReturnType<typeof createGroupSchema>>

export function createDefaultGroupValues(branchId: string, startDate: string): GroupFormValues {
  return {
    name: '',
    courseId: '',
    branchId,
    teacherId: '',
    roomId: '',
    startDate,
    endDate: '',
    daysSchedule: DAY_SCHEDULE_TYPE.OddDays,
    customDays: [],
    startTime: GROUP_FORM_DEFAULTS.startTime,
    endTime: GROUP_FORM_DEFAULTS.endTime,
    monthlyPrice: 0,
    capacity: GROUP_FORM_DEFAULTS.capacity,
    billingMode: BILLING_MODE.MonthlyCalendar,
    status: GROUP_STATUS.Recruiting,
  }
}

export function groupToFormValues(group: GroupResponse): GroupFormValues {
  return {
    name: group.name,
    courseId: group.courseId,
    branchId: group.branchId,
    teacherId: group.teacherId,
    roomId: group.roomId,
    startDate: group.startDate,
    endDate: group.endDate ?? '',
    daysSchedule: group.daysSchedule,
    customDays: group.customDays ?? [],
    startTime: shortTime(group.startTime),
    endTime: shortTime(group.endTime),
    monthlyPrice: group.monthlyPrice,
    capacity: group.capacity,
    billingMode: group.billingMode,
    status: group.status,
  }
}

export function toGroupRequest(values: GroupFormValues, id?: string | null): CreateOrUpdateGroupRequest {
  const isCustom = values.daysSchedule === DAY_SCHEDULE_TYPE.Custom

  return {
    id: id ?? null,
    name: values.name.trim(),
    courseId: values.courseId,
    teacherId: values.teacherId,
    branchId: values.branchId,
    roomId: values.roomId,
    startDate: values.startDate,
    endDate: values.endDate === '' ? null : values.endDate,
    daysSchedule: values.daysSchedule,
    customDays: isCustom ? values.customDays : null,
    startTime: toApiTime(values.startTime),
    endTime: toApiTime(values.endTime),
    monthlyPrice: values.monthlyPrice,
    capacity: values.capacity,
    billingMode: values.billingMode,
    status: values.status,
  }
}
