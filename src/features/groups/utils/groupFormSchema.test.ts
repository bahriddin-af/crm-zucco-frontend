import { getTranslations } from '@/i18n'
import { DAY_OF_WEEK, DAY_SCHEDULE_TYPE } from '../types/groupTypes'
import { createDefaultGroupValues, createGroupSchema, toGroupRequest, type GroupFormValues } from './groupFormSchema'

const t = getTranslations('en')
const schema = createGroupSchema(t)

const validValues: GroupFormValues = {
  ...createDefaultGroupValues('branch-1', '2026-11-02'),
  name: 'IELTS-01',
  courseId: 'course-1',
  teacherId: 'teacher-1',
  roomId: 'room-1',
  monthlyPrice: 600000,
}

const issuesFor = (values: GroupFormValues, field: keyof GroupFormValues) => {
  const result = schema.safeParse(values)
  return result.success ? [] : result.error.issues.filter((issue) => issue.path[0] === field).map((issue) => issue.message)
}

describe('createGroupSchema', () => {
  it('accepts a valid group', () => {
    expect(schema.safeParse(validValues).success).toBe(true)
  })

  it('requires custom days when the schedule type is Custom', () => {
    const values = { ...validValues, daysSchedule: DAY_SCHEDULE_TYPE.Custom, customDays: [] }
    expect(issuesFor(values, 'customDays')).toEqual([t.groups.validation.customDaysRequired])

    const withDays = { ...values, customDays: [DAY_OF_WEEK.Monday, DAY_OF_WEEK.Thursday] }
    expect(schema.safeParse(withDays).success).toBe(true)
  })

  it('ignores empty custom days for non-custom schedules', () => {
    expect(issuesFor({ ...validValues, daysSchedule: DAY_SCHEDULE_TYPE.EvenDays }, 'customDays')).toEqual([])
  })

  it('requires the end time to be after the start time', () => {
    expect(issuesFor({ ...validValues, startTime: '15:00', endTime: '15:00' }, 'endTime')).toEqual([
      t.groups.validation.endTimeAfterStart,
    ])
    expect(issuesFor({ ...validValues, startTime: '16:00', endTime: '14:30' }, 'endTime')).toEqual([
      t.groups.validation.endTimeAfterStart,
    ])
  })

  it('rejects an end date before the start date and invalid price/capacity', () => {
    expect(issuesFor({ ...validValues, endDate: '2026-10-01' }, 'endDate')).toEqual([t.groups.validation.endDateBeforeStart])
    expect(issuesFor({ ...validValues, monthlyPrice: 10.555 }, 'monthlyPrice')).toEqual([t.groups.validation.priceInvalid])
    expect(issuesFor({ ...validValues, capacity: 0 }, 'capacity')).toEqual([t.groups.validation.capacityInvalid])
  })
})

describe('toGroupRequest', () => {
  it('sends customDays only for Custom schedules and converts times to TimeOnly', () => {
    const request = toGroupRequest({ ...validValues, customDays: [DAY_OF_WEEK.Friday] }, 'group-1')
    expect(request).toMatchObject({ id: 'group-1', customDays: null, startTime: '14:00:00', endTime: '15:30:00', endDate: null })

    const custom = toGroupRequest({ ...validValues, daysSchedule: DAY_SCHEDULE_TYPE.Custom, customDays: [DAY_OF_WEEK.Friday] })
    expect(custom.customDays).toEqual([DAY_OF_WEEK.Friday])
    expect(custom.id).toBeNull()
  })
})
