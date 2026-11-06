import { describe, expect, it } from 'vitest'
import { LESSON_STATUS, type ScheduleLessonResponse } from '@/features/groups/types/groupTypes'
import { pickTeacherDefaultLesson } from './teacherLessons'

const lesson = (id: string, lessonDate: string, status: ScheduleLessonResponse['status'] = LESSON_STATUS.Scheduled) =>
  ({
    id,
    groupId: 'g1',
    groupName: 'IELTS-01',
    teacherId: 't1',
    teacherName: 'Teacher',
    roomId: 'r1',
    roomName: 'Room',
    lessonDate,
    startTime: '09:00:00',
    endTime: '10:30:00',
    status,
  }) satisfies ScheduleLessonResponse

describe('pickTeacherDefaultLesson', () => {
  it("picks the latest non-cancelled lesson up to today", () => {
    const lessons = [lesson('a', '2026-11-01'), lesson('b', '2026-11-05'), lesson('c', '2026-11-06', LESSON_STATUS.Cancelled)]
    expect(pickTeacherDefaultLesson(lessons, '2026-11-06')?.id).toBe('b')
  })

  it('falls back to the last lesson when none is eligible', () => {
    const lessons = [lesson('a', '2026-11-07'), lesson('b', '2026-11-08')]
    expect(pickTeacherDefaultLesson(lessons, '2026-11-06')?.id).toBe('b')
  })

  it('returns undefined for an empty list', () => {
    expect(pickTeacherDefaultLesson([], '2026-11-06')).toBeUndefined()
  })
})
