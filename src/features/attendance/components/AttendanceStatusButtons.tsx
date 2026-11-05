import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, Check, Clock, X } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_ORDER, type AttendanceStatus } from '../types/attendanceTypes'

const STATUS_STYLE: Record<AttendanceStatus, { icon: LucideIcon; active: string; idle: string }> = {
  [ATTENDANCE_STATUS.Present]: {
    icon: Check,
    active: 'bg-success-ink text-white',
    idle: 'bg-success-soft text-success-ink hover:bg-success-line',
  },
  [ATTENDANCE_STATUS.Late]: {
    icon: Clock,
    active: 'bg-warning-strong text-white',
    idle: 'bg-warning-soft text-warning-strong hover:bg-warning-tint',
  },
  [ATTENDANCE_STATUS.Excused]: {
    icon: AlertTriangle,
    active: 'bg-neutral-ink text-white',
    idle: 'bg-neutral-soft text-neutral-ink hover:bg-neutral-line',
  },
  [ATTENDANCE_STATUS.Unexcused]: {
    icon: X,
    active: 'bg-debt-ink text-white',
    idle: 'bg-debt-soft text-debt-ink hover:bg-debt-line',
  },
}

interface AttendanceStatusButtonsProps {
  value?: AttendanceStatus | null
  disabled: boolean
  onSelect: (status: AttendanceStatus) => void
}

export function AttendanceStatusButtons({ value, disabled, onSelect }: AttendanceStatusButtonsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t.attendance.status}>
      {ATTENDANCE_STATUS_ORDER.map((status) => {
        const style = STATUS_STYLE[status]
        const Icon = style.icon
        const isActive = value === status
        return (
          <button
            key={status}
            type="button"
            aria-pressed={isActive}
            disabled={disabled}
            onClick={() => !isActive && onSelect(status)}
            className={cn(
              'px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
              isActive ? style.active : style.idle
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{t.attendance.statuses[status]}</span>
          </button>
        )
      })}
    </div>
  )
}
