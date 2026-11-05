import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useTranslation } from '@/i18n'
import { filterColumnLeads } from '../utils/kanban'
import { LEAD_STAGE_TYPE, type KanbanColumn } from '../types/leadTypes'
import type { LeadCardActions } from './LeadCard'
import { LeadKanbanColumn } from './LeadKanbanColumn'

const SKELETON_COLUMNS = 5

/** "Keyingi bosqich" tugmasi yakuniy bosqichlarga olib bormaydi — ular uchun alohida amallar bor. */
const isTerminalStage = (column?: KanbanColumn) =>
  column?.stageType === LEAD_STAGE_TYPE.Converted || column?.stageType === LEAD_STAGE_TYPE.Lost

interface LeadKanbanBoardProps extends LeadCardActions {
  columns: KanbanColumn[]
  isLoading: boolean
  error: unknown
  onRetry: () => void
  search: string
  canCreate: boolean
  onCreate: (stageId: string) => void
}

export function LeadKanbanBoard({ columns, isLoading, error, onRetry, search, ...columnProps }: LeadKanbanBoardProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: SKELETON_COLUMNS }, (_, index) => (
          <div key={index} className="w-72 shrink-0 bg-canvas rounded-lg p-3 space-y-3 border border-border">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) return <ErrorState error={error} onRetry={onRetry} />

  if (columns.length === 0) return <EmptyState description={t.leads.emptyBoard} />

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px] select-none">
      {columns.map((column, index) => {
        const next = columns[index + 1]
        return (
          <LeadKanbanColumn
            key={column.stageId}
            column={column}
            leads={filterColumnLeads(column, search)}
            nextStage={next && !isTerminalStage(next) ? { id: next.stageId, name: next.stageName } : undefined}
            {...columnProps}
          />
        )
      })}
    </div>
  )
}
