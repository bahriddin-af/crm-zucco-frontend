import type { DragEvent } from 'react'
import { ArrowRight, Phone, UserCheck, XCircle } from 'lucide-react'
import { interpolate, useTranslation } from '@/i18n'
import { formatPhone } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import { LEAD_DRAG_DATA_TYPE } from '../constants/stageStyles'
import type { LeadListItem, LeadStageDto } from '../types/leadTypes'

export interface LeadCardActions {
  canUpdate: boolean
  canConvert: boolean
  onMoveStage: (leadId: string, targetStageId: string) => void
  onConvert: (lead: LeadListItem) => void
  onLost: (lead: LeadListItem) => void
  onOpen: (lead: LeadListItem) => void
}

interface LeadCardProps extends LeadCardActions {
  lead: LeadListItem
  nextStage?: Pick<LeadStageDto, 'id' | 'name'>
}

export function LeadCard({ lead, nextStage, canUpdate, canConvert, onMoveStage, onConvert, onLost, onOpen }: LeadCardProps) {
  const { t } = useTranslation()
  const moveLabel = nextStage ? interpolate(t.leads.moveTo, { stage: nextStage.name }) : undefined

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(LEAD_DRAG_DATA_TYPE, lead.id)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable={canUpdate}
      onDragStart={canUpdate ? handleDragStart : undefined}
      title={canUpdate ? t.leads.dragHint : undefined}
      className={cn(
        'bg-white border border-border rounded-lg p-3.5 shadow-xs space-y-2.5 hover:border-primary-line hover:shadow-sm transition-all',
        canUpdate && 'cursor-grab active:cursor-grabbing'
      )}
    >
      <div className="flex items-start justify-between gap-1.5">
        <button
          type="button"
          onClick={() => onOpen(lead)}
          className="text-xs font-bold text-heading truncate text-left hover:text-primary transition-colors"
        >
          {lead.fullName}
        </button>
        {lead.courseName && (
          <span className="text-[10px] font-medium text-primary bg-primary-soft px-1.5 py-0.5 rounded shrink-0 truncate max-w-[100px]">
            {lead.courseName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-caption">
        <Phone className="w-3 h-3 text-subtle" />
        <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors font-medium tabular-nums">
          {formatPhone(lead.phone)}
        </a>
      </div>

      {(canUpdate || canConvert) && (
        <div className="pt-2 border-t border-divider flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            {canConvert && (
              <button
                type="button"
                onClick={() => onConvert(lead)}
                title={t.leads.card.convertTitle}
                className="p-1 rounded text-primary hover:bg-primary-soft transition-colors flex items-center gap-1 text-[11px] font-medium"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.leads.card.convert}</span>
              </button>
            )}
            {canUpdate && (
              <button
                type="button"
                onClick={() => onLost(lead)}
                title={t.leads.card.lost}
                aria-label={t.leads.card.lost}
                className="p-1 rounded text-debt-ink hover:bg-debt-soft transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {canUpdate && nextStage && (
            <button
              type="button"
              onClick={() => onMoveStage(lead.id, nextStage.id)}
              title={moveLabel}
              aria-label={moveLabel}
              className="p-1 px-1.5 rounded bg-canvas hover:bg-primary-soft text-primary text-[10px] font-medium transition-colors flex items-center gap-0.5 max-w-[110px]"
            >
              <span className="truncate">{nextStage.name}</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
