import { Link, createSearchParams } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { interpolate, useTranslation } from '@/i18n'
import { formatDate } from '@/utils/formatters'
import { parseIsoDate } from '@/utils/dateUtils'
import { cn } from '@/utils/cn'
import { useStudentRiskSummary } from '@/features/students/hooks/useStudentRisk'
import { RISK_LEVEL_PARAM } from '@/features/students/constants/studentRiskConstants'
import { RISK_LEVEL, type RiskLevel, type StudentRiskSummary } from '@/features/students/types/studentRiskTypes'
import { WidgetCard } from './WidgetCard'

const SKELETON_ROWS = 1

/** Yuqoridan pastga: eng muhim daraja birinchi. */
const LEVEL_TILES: { level: RiskLevel; count: (summary: StudentRiskSummary) => number; className: string }[] = [
  { level: RISK_LEVEL.High, count: (s) => s.high, className: 'bg-debt-soft text-debt-ink' },
  { level: RISK_LEVEL.Medium, count: (s) => s.medium, className: 'bg-warning-soft text-warning-ink' },
  { level: RISK_LEVEL.Low, count: (s) => s.low, className: 'bg-success-soft text-success-ink' },
]

const levelLink = (level: RiskLevel) =>
  `${ROUTES.STUDENTS.RISK}?${createSearchParams({ [RISK_LEVEL_PARAM]: String(level) })}`

/** Bosh sahifadagi «Ketib qolish xavfi»: har bir daraja soni filtrlangan ro'yxatga havola. */
export function RiskSummaryWidget({ className }: { className?: string }) {
  const { t } = useTranslation()
  const { data: summary, isLoading, error, refetch } = useStudentRiskSummary()

  return (
    <WidgetCard
      title={t.risk.widget.title}
      icon={<TriangleAlert className="w-4 h-4 text-primary" />}
      linkTo={ROUTES.STUDENTS.RISK}
      linkLabel={t.risk.widget.viewAll}
      className={className}
    >
      {isLoading && <ListSkeleton rows={SKELETON_ROWS} rowClassName="h-16 w-full" className="p-5" />}
      {error && <ErrorState error={error} onRetry={() => void refetch()} className="m-4" />}
      {summary && !summary.snapshotDate && (
        <EmptyState description={t.risk.widget.noSnapshot} className="m-4 border-none" />
      )}
      {summary?.snapshotDate && (
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {LEVEL_TILES.map(({ level, count, className: tileClass }) => (
              <Link
                key={level}
                to={levelLink(level)}
                className={cn('rounded-md p-3 text-center transition-opacity hover:opacity-80', tileClass)}
              >
                <span className="block text-2xl font-bold tabular-nums">{count(summary)}</span>
                <span className="block text-2xs font-medium">{t.risk.levels[level]}</span>
              </Link>
            ))}
          </div>
          <p className="text-3xs text-caption flex justify-between gap-2">
            <span>{interpolate(t.risk.widget.evaluated, { count: summary.total })}</span>
            <span>{interpolate(t.risk.lastCalculated, { date: formatDate(parseIsoDate(summary.snapshotDate)) })}</span>
          </p>
        </div>
      )}
    </WidgetCard>
  )
}
