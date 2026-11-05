import { useState, type DragEvent } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { getStageStyle, LEAD_DRAG_DATA_TYPE } from '../constants/stageStyles'
import type { KanbanColumn, LeadListItem, LeadStageDto } from '../types/leadTypes'
import { LeadCard, type LeadCardActions } from './LeadCard'

interface LeadKanbanColumnProps extends LeadCardActions {
  column: KanbanColumn
  leads: LeadListItem[]
  nextStage?: Pick<LeadStageDto, 'id' | 'name'>
  canCreate: boolean
  onCreate: (stageId: string) => void
}

export function LeadKanbanColumn({ column, leads, nextStage, canCreate, onCreate, ...cardActions }: LeadKanbanColumnProps) {
  const { t } = useTranslation()
  const [isDragOver, setIsDragOver] = useState(false)
  const acceptsDrop = cardActions.canUpdate

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    if (!event.dataTransfer.types.includes(LEAD_DRAG_DATA_TYPE)) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    const leadId = event.dataTransfer.getData(LEAD_DRAG_DATA_TYPE)
    const isAlreadyHere = column.leads.some((lead) => lead.id === leadId)
    if (leadId && !isAlreadyHere) cardActions.onMoveStage(leadId, column.stageId)
  }

  return (
    <section
      aria-label={column.stageName}
      onDragOver={acceptsDrop ? handleDragOver : undefined}
      onDragLeave={acceptsDrop ? () => setIsDragOver(false) : undefined}
      onDrop={acceptsDrop ? handleDrop : undefined}
      className={cn(
        'w-72 shrink-0 bg-canvas rounded-lg border border-border flex flex-col max-h-[75vh] transition-colors',
        isDragOver && 'border-primary bg-primary-soft'
      )}
    >
      <div
        className={cn(
          'p-3 border-b border-border border-t-[3px] bg-surface rounded-t-lg flex items-center justify-between',
          getStageStyle(column.stageType).border
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-xs font-bold text-heading truncate">{column.stageName}</h3>
          <span className="text-3xs font-bold text-copy-strong bg-primary-soft px-1.5 rounded-full tabular-nums">
            {column.totalLeads}
          </span>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => onCreate(column.stageId)}
            title={t.leads.addToStage}
            aria-label={t.leads.addToStage}
            className="w-5 h-5 rounded hover:bg-divider flex items-center justify-center text-caption"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
        {leads.length === 0 ? (
          <div className="py-8 text-center text-xs text-subtle">{t.leads.noLeads}</div>
        ) : (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} nextStage={nextStage} {...cardActions} />)
        )}
      </div>
    </section>
  )
}
