import type { BadgeProps } from '@/components/ui/Badge'
import { GROUP_STATUS, type GroupStatus } from '../types/groupTypes'

export const GROUP_STATUS_VARIANT: Record<GroupStatus, NonNullable<BadgeProps['variant']>> = {
  [GROUP_STATUS.Recruiting]: 'accent',
  [GROUP_STATUS.Active]: 'success',
  [GROUP_STATUS.Frozen]: 'warning',
  [GROUP_STATUS.Completed]: 'default',
}
