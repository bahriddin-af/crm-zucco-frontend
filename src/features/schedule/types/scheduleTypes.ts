export type { ScheduleLessonResponse, ScheduleQuery } from '@/features/groups/types/groupTypes'

/** Jadval sahifasi filtrlari ('' — filtr qo'llanmagan). */
export interface ScheduleFiltersValue {
  branchId: string
  teacherId: string
  roomId: string
}
