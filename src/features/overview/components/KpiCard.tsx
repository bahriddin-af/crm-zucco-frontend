import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { cn } from '@/utils/cn'

type KpiTone = 'primary' | 'success' | 'debt'

const TONE_ICON_CLASS: Record<KpiTone, string> = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  debt: 'bg-debt-soft text-debt',
}

const TONE_VALUE_CLASS: Record<KpiTone, string> = {
  primary: 'text-heading',
  success: 'text-heading',
  debt: 'text-debt-ink',
}

interface KpiCardProps {
  label: string
  icon: LucideIcon
  tone?: KpiTone
  value: ReactNode
  hint?: ReactNode
  isLoading: boolean
  error?: unknown
  onRetry?: () => void
}

export function KpiCard({ label, icon: Icon, tone = 'primary', value, hint, isLoading, error, onRetry }: KpiCardProps) {
  return (
    <div className="p-4 bg-white border border-border rounded-lg shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-caption">{label}</span>
        <div className={cn('w-7 h-7 rounded-md flex items-center justify-center', TONE_ICON_CLASS[tone])}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      {isLoading && <Skeleton className="h-7 w-28" />}
      {!isLoading && Boolean(error) && <ErrorState error={error} onRetry={onRetry} className="py-3" />}
      {!isLoading && !error && (
        <>
          <div className={cn('text-2xl font-bold tabular-nums tracking-tight', TONE_VALUE_CLASS[tone])}>{value}</div>
          {hint && <div className="mt-2 text-[10px] text-caption">{hint}</div>}
        </>
      )}
    </div>
  )
}
