/**
 * Backend `DateOnly` (`yyyy-MM-dd`), `TimeOnly` (`HH:mm:ss`) va `MonthPeriod` (`yyyy-MM`) bilan ishlash
 * yordamchilari. Barcha hisoblar mahalliy vaqt bo'yicha (UTC'ga o'tkazmasdan, kun siljimasligi uchun).
 */

const PAD_LENGTH = 2
const SHORT_TIME_LENGTH = 5

const pad = (value: number) => String(value).padStart(PAD_LENGTH, '0')

/** Backend `DateOnly` / `<input type="date">` formati. */
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** `HH:mm` (`<input type="time">`). */
export const SHORT_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

/** Backend `MonthPeriod.Parse` qabul qiladigan `yyyy-MM` format. */
export const MONTH_PERIOD_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/

/** Mahalliy sana → `yyyy-MM-dd`. */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** `yyyy-MM-dd` → mahalliy yarim tun. */
export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function todayIsoDate(): string {
  return toIsoDate(new Date())
}

/** Bugundan `days` kun keyingi (manfiy bo'lsa — oldingi) sana, `yyyy-MM-dd`. */
export function addDaysIsoDate(days: number): string {
  return toIsoDate(addDays(new Date(), days))
}

/** Berilgan sananing oyini `yyyy-MM` ko'rinishida qaytaradi (standart: joriy oy). */
export function toMonthPeriod(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

/** `HH:mm:ss` → `HH:mm` (UI va `<input type="time">` uchun). */
export function shortTime(value: string): string {
  return value.slice(0, SHORT_TIME_LENGTH)
}

/** `HH:mm` → `HH:mm:ss` (backend `TimeOnly`). */
export function toApiTime(value: string): string {
  return value.length === SHORT_TIME_LENGTH ? `${value}:00` : value
}
