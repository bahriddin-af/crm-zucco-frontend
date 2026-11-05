import type { ScheduleLessonResponse } from '@/features/groups/types/groupTypes'
import { addDays, parseIsoDate, toIsoDate } from '@/utils/dateUtils'

export const DAYS_IN_WEEK = 7
/** `Date.getDay()` dushanbani 1 deb beradi; haftani dushanbadan boshlash uchun siljitish. */
const MONDAY_OFFSET = 6

/** Berilgan sana tushgan haftaning dushanbasi (`yyyy-MM-dd`). */
export function getWeekStart(date: Date): string {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const offset = (day.getDay() + MONDAY_OFFSET) % DAYS_IN_WEEK
  return toIsoDate(addDays(day, -offset))
}

/** Dushanbadan yakshanbagacha 7 kun (`yyyy-MM-dd`). */
export function getWeekDays(weekStart: string): string[] {
  const monday = parseIsoDate(weekStart)
  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => toIsoDate(addDays(monday, index)))
}

/** Backend `API_ROUTES.GROUPS.SCHEDULE` uchun oraliq (ikkala chegara ham kiradi, 42 kunlik limitdan ancha kam). */
export function getWeekRange(weekStart: string): { from: string; to: string } {
  const days = getWeekDays(weekStart)
  return { from: days[0], to: days[days.length - 1] }
}

export function shiftWeek(weekStart: string, weeks: number): string {
  return toIsoDate(addDays(parseIsoDate(weekStart), weeks * DAYS_IN_WEEK))
}

/** Darslarni sana bo'yicha guruhlaydi va har kun ichida vaqt bo'yicha saralaydi. */
export function groupLessonsByDate(lessons: readonly ScheduleLessonResponse[]): Map<string, ScheduleLessonResponse[]> {
  const byDate = new Map<string, ScheduleLessonResponse[]>()
  for (const lesson of lessons) {
    const bucket = byDate.get(lesson.lessonDate) ?? []
    bucket.push(lesson)
    byDate.set(lesson.lessonDate, bucket)
  }
  for (const bucket of byDate.values()) {
    bucket.sort((a, b) => a.startTime.localeCompare(b.startTime) || a.roomName.localeCompare(b.roomName))
  }
  return byDate
}
