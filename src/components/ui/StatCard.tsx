import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'

export type StatTone = 'neutral' | 'positive' | 'negative' | 'warning'

const VALUE_TONE: Record<StatTone, string> = {
  neutral: 'text-heading',
  positive: 'text-success-ink',
  negative: 'text-debt-ink',
  warning: 'text-warning-ink',
}

const ICON_TONE: Record<StatTone, string> = {
  neutral: 'bg-primary-soft text-primary',
  positive: 'bg-success-soft text-success-ink',
  negative: 'bg-debt-soft text-debt-ink',
  warning: 'bg-warning-soft text-warning-strong',
}

interface StatCardProps {
  label: string
  value: string
  hint?: ReactNode
  icon?: ReactNode
  tone?: StatTone
  isLoading?: boolean
}

/** KPI kartochkasi: yorliq, qiymat (tonga qarab rang), ixtiyoriy ikonka va izoh. */
export function StatCard({ label, value, hint, icon, tone = 'neutral', isLoading }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-lg border border-border shadow-xs">
      <div className="flex items-center justify-between text-caption mb-2">
        <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
        {icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', ICON_TONE[tone])}>
            {icon}
          </div>
        )}
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-3/4" />
      ) : (
        <div className={cn('text-2xl font-bold tabular-nums', VALUE_TONE[tone])}>{value}</div>
      )}
      {hint && <div className="text-[11px] text-caption mt-1.5">{hint}</div>}
    </div>
  )
}
