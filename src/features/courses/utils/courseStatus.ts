import type { BadgeProps } from '@/components/ui/Badge'
import { COURSE_STATUS, type CourseStatus } from '../types/courseTypes'

export const COURSE_STATUS_VARIANT: Record<CourseStatus, NonNullable<BadgeProps['variant']>> = {
  [COURSE_STATUS.Active]: 'success',
  [COURSE_STATUS.Inactive]: 'warning',
  [COURSE_STATUS.Archived]: 'default',
}
