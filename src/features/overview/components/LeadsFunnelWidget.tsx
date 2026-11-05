import { ROUTES } from '@/routes/paths'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { useKanbanBoard } from '@/features/leads/hooks/useLeads'
import { getStageStyle, percentToWidthClass } from '@/features/leads/constants/stageStyles'
import { WidgetCard } from './WidgetCard'

const SKELETON_ROWS = 5
const FULL_PERCENT = 100

export function LeadsFunnelWidget() {
  const { t } = useTranslation()
  const { data: columns = [], isLoading, error, refetch } = useKanbanBoard()
  const totalLeads = columns.reduce((sum, column) => sum + column.totalLeads, 0)

  return (
    <WidgetCard title={t.overview.funnelState} linkTo={ROUTES.LEADS.LIST} linkLabel={t.overview.goToFunnel}>
      <div className="p-4 space-y-3.5 flex-1">
        {isLoading &&
          Array.from({ length: SKELETON_ROWS }, (_, index) => <Skeleton key={index} className="h-6 w-full" />)}
        {error && <ErrorState error={error} onRetry={() => void refetch()} />}
        {!isLoading && !error && columns.length === 0 && (
          <EmptyState description={t.overview.noStages} className="border-none" />
        )}
        {columns.map((column) => {
          const percent = totalLeads > 0 ? (column.totalLeads / totalLeads) * FULL_PERCENT : 0
          return (
            <div key={column.stageId} className="space-y-1">
              <div className="flex justify-between text-2xs">
                <span className="text-caption">{column.stageName}</span>
                <span className="font-semibold text-heading tabular-nums">{column.totalLeads}</span>
              </div>
              <div className="h-1.5 w-full bg-divider-strong rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    percentToWidthClass(percent),
                    getStageStyle(column.stageType).bar
                  )}
                />
              </div>
            </div>
          )
        })}
      </div>
    </WidgetCard>
  )
}
