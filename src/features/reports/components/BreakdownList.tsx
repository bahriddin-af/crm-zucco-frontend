import { EmptyState } from '@/components/ui/EmptyState'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import { SectionCard } from '@/components/ui/SectionCard'
import { widthClass } from '../utils/reportMath'

export interface BreakdownItem {
  key: string
  label: string
  amount: number
}

interface BreakdownListProps {
  title: string
  items: BreakdownItem[]
  tone: 'positive' | 'negative'
}

const BAR_TONE = {
  positive: 'bg-success',
  negative: 'bg-debt',
} as const

/** Summalar taqsimoti: har bir qator uchun eng katta qiymatga nisbatan gorizontal ustun. */
export function BreakdownList({ title, items, tone }: BreakdownListProps) {
  const { t } = useTranslation()
  const sorted = [...items].sort((a, b) => b.amount - a.amount)
  const max = sorted[0]?.amount ?? 0

  return (
    <SectionCard title={title}>
      {sorted.length === 0 ? (
        <EmptyState title={t.reports.emptyBreakdown} description="" className="border-0 py-6" />
      ) : (
        <ul className="space-y-3">
          {sorted.map((item) => (
            <li key={item.key}>
              <div className="flex items-center justify-between gap-3 text-xs mb-1">
                <span className="text-heading font-medium truncate">{item.label}</span>
                <span className="text-copy-strong tabular-nums font-semibold">{formatCurrency(item.amount)}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-divider overflow-hidden">
                <div className={cn('h-full rounded-full', BAR_TONE[tone], widthClass(item.amount, max))} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
