import type { BadgeProps } from '@/components/ui/Badge'
import { ATTENDANCE_STATUS, type AttendanceStatus } from '../types/attendanceTypes'

export const ATTENDANCE_STATUS_VARIANT: Record<AttendanceStatus, NonNullable<BadgeProps['variant']>> = {
  [ATTENDANCE_STATUS.Present]: 'success',
  [ATTENDANCE_STATUS.Late]: 'warning',
  [ATTENDANCE_STATUS.Excused]: 'accent',
  [ATTENDANCE_STATUS.Unexcused]: 'danger',
}
