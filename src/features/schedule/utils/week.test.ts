import type { ScheduleLessonResponse } from '@/features/groups/types/groupTypes'
import { LESSON_STATUS } from '@/features/groups/types/groupTypes'
import { getWeekDays, getWeekRange, getWeekStart, groupLessonsByDate, shiftWeek } from './week'

describe('week utils', () => {
  it('starts the week on Monday for any day of the week', () => {
    // 2026-11-05 — payshanba
    expect(getWeekStart(new Date(2026, 10, 5))).toBe('2026-11-02')
    expect(getWeekStart(new Date(2026, 10, 2))).toBe('2026-11-02')
    // Yakshanba oldingi haftaga tegishli
    expect(getWeekStart(new Date(2026, 10, 8, 23, 59))).toBe('2026-11-02')
    expect(getWeekStart(new Date(2026, 10, 9))).toBe('2026-11-09')
  })

  it('builds a Monday–Sunday range across month and year boundaries', () => {
    expect(getWeekRange('2026-11-02')).toEqual({ from: '2026-11-02', to: '2026-11-08' })
    expect(getWeekRange('2026-12-28')).toEqual({ from: '2026-12-28', to: '2027-01-03' })
    expect(getWeekDays('2026-11-30')).toEqual([
      '2026-11-30',
      '2026-12-01',
      '2026-12-02',
      '2026-12-03',
      '2026-12-04',
      '2026-12-05',
      '2026-12-06',
    ])
  })

  it('moves by whole weeks', () => {
    expect(shiftWeek('2026-11-02', 1)).toBe('2026-11-09')
    expect(shiftWeek('2026-11-02', -1)).toBe('2026-10-26')
  })

  it('groups lessons by date sorted by start time', () => {
    const lesson = (id: string, lessonDate: string, startTime: string): ScheduleLessonResponse => ({
      id,
      groupId: 'g',
      groupName: id,
      teacherId: 't',
      teacherName: 'Teacher',
      roomId: 'r',
      roomName: 'Room',
      lessonDate,
      startTime,
      endTime: '20:00:00',
      status: LESSON_STATUS.Scheduled,
    })
    const byDate = groupLessonsByDate([
      lesson('late', '2026-11-02', '18:00:00'),
      lesson('early', '2026-11-02', '09:00:00'),
      lesson('other', '2026-11-04', '10:00:00'),
    ])
    expect(byDate.get('2026-11-02')?.map((item) => item.id)).toEqual(['early', 'late'])
    expect(byDate.get('2026-11-04')).toHaveLength(1)
    expect(byDate.get('2026-11-03')).toBeUndefined()
  })
})
