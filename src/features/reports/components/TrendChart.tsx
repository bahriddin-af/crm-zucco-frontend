import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import { SectionCard } from '@/components/ui/SectionCard'
import type { ReportTrendPoint } from '../types/reportTypes'
import { heightClass } from '../utils/reportMath'

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-2xs text-caption">
      <span className={cn('w-2.5 h-2.5 rounded-sm', className)} />
      {label}
    </span>
  )
}

/** So'nggi oylar tushum/xarajat dinamikasi — faqat Tailwind klasslari bilan chizilgan ustunlar. */
export function TrendChart({ points }: { points: ReportTrendPoint[] }) {
  const { t } = useTranslation()
  const messages = t.reports
  const max = Math.max(0, ...points.flatMap((point) => [point.revenue, point.expenses]))

  return (
    <SectionCard
      title={messages.trend}
      subtitle={messages.trendSubtitle}
      actions={
        <>
          <LegendDot className="bg-success" label={messages.legendRevenue} />
          <LegendDot className="bg-debt" label={messages.legendExpenses} />
        </>
      }
    >
      <div className="grid grid-flow-col auto-cols-fr gap-3 items-end h-48" role="list">
        {points.map((point) => (
          <div key={point.period} role="listitem" className="flex flex-col items-center gap-2">
            <div className="flex items-end gap-1 h-40">
              <div
                title={`${messages.legendRevenue}: ${formatCurrency(point.revenue)}`}
                className={cn('w-3 sm:w-4 rounded-t bg-success', heightClass(point.revenue, max))}
              />
              <div
                title={`${messages.legendExpenses}: ${formatCurrency(point.expenses)}`}
                className={cn('w-3 sm:w-4 rounded-t bg-debt', heightClass(point.expenses, max))}
              />
            </div>
            <span className="text-3xs text-caption tabular-nums">{point.period}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
