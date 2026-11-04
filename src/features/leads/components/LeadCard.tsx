import { Phone, ArrowRight, UserCheck, XCircle } from 'lucide-react'
import type { LeadListItem, LeadStageDto } from '../types/leadTypes'

interface LeadCardProps {
  lead: LeadListItem
  stages: LeadStageDto[]
  onMoveStage: (leadId: string, targetStageId: string) => void
  onConvert: (lead: LeadListItem) => void
  onLost: (lead: LeadListItem) => void
}

export function LeadCard({
  lead,
  stages,
  onMoveStage,
  onConvert,
  onLost,
}: LeadCardProps) {
  const currentStageIndex = stages.findIndex((s) => s.id === lead.stageId)
  const nextStage =
    currentStageIndex >= 0 && currentStageIndex < stages.length - 1
      ? stages[currentStageIndex + 1]
      : null

  return (
    <div className="bg-white border border-[#E3EAE5] rounded-lg p-3.5 shadow-xs space-y-2.5 hover:border-[#BBDCCB] hover:shadow-sm transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between gap-1.5">
        <h4 className="text-xs font-bold text-[#1E2B24] truncate group-hover:text-[#146B52] transition-colors">
          {lead.fullName}
        </h4>
        {lead.courseName && (
          <span className="text-[10px] font-medium text-[#146B52] bg-[#E8F3ED] px-1.5 py-0.5 rounded shrink-0 truncate max-w-[100px]">
            {lead.courseName}
          </span>
        )}
      </div>

      {/* Phone */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#65776C]">
        <Phone className="w-3 h-3 text-[#8B9C91]" />
        <a
          href={`tel:${lead.phone}`}
          className="hover:text-[#146B52] transition-colors font-medium tabular-nums"
        >
          {lead.phone}
        </a>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-[#F0F4F1] flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          {/* Convert to Student */}
          <button
            type="button"
            onClick={() => onConvert(lead)}
            title="Талабага айлантириш"
            className="p-1 rounded text-[#146B52] hover:bg-[#E8F3ED] transition-colors flex items-center gap-1 text-[11px] font-medium"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Қабул</span>
          </button>

          {/* Mark Lost */}
          <button
            type="button"
            onClick={() => onLost(lead)}
            title="Рад этилди"
            className="p-1 rounded text-[#BE123C] hover:bg-[#FFF1F2] transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Move to next stage button */}
        {nextStage && (
          <button
            type="button"
            onClick={() => onMoveStage(lead.id, nextStage.id)}
            title={`${nextStage.name} босқичига ўтказиш`}
            className="p-1 px-1.5 rounded bg-[#F6F8F7] hover:bg-[#E8F3ED] text-[#146B52] text-[10px] font-medium transition-colors flex items-center gap-0.5"
          >
            <span>{nextStage.name.slice(0, 8)}..</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}
