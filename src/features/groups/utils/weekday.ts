import type { DayOfWeek } from '../types/groupTypes'

/** `Date.getDay()` qiymati .NET `DayOfWeek` bilan bir xil (0 = Yakshanba). */
export function getWeekday(date: Date): DayOfWeek {
  return date.getDay() as DayOfWeek
}
