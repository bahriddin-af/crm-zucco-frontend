import type { BadgeProps } from '@/components/ui/Badge'
import { LESSON_STATUS, type LessonStatus } from '../types/groupTypes'

export const LESSON_STATUS_VARIANT: Record<LessonStatus, NonNullable<BadgeProps['variant']>> = {
  [LESSON_STATUS.Scheduled]: 'accent',
  [LESSON_STATUS.InProgress]: 'warning',
  [LESSON_STATUS.Completed]: 'success',
  [LESSON_STATUS.Cancelled]: 'danger',
  [LESSON_STATUS.Rescheduled]: 'default',
}

/** Backend `Lesson.Cancel`: o'tilgan va allaqachon bekor qilingan dars bekor qilinmaydi. */
export function canCancelLesson(status: LessonStatus): boolean {
  return status !== LESSON_STATUS.Completed && status !== LESSON_STATUS.Cancelled
}
