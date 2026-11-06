import type { BadgeProps } from '@/components/ui/Badge'
import { LEAD_STATUS, type LeadStatus } from '../types/leadTypes'

export const LEAD_STATUS_VARIANT: Record<LeadStatus, NonNullable<BadgeProps['variant']>> = {
  [LEAD_STATUS.Active]: 'accent',
  [LEAD_STATUS.Converted]: 'success',
  [LEAD_STATUS.Lost]: 'danger',
}
