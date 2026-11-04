import { Phone, Calendar, ArrowRight, XCircle } from 'lucide-react'
import type { Lead } from '../types/leadTypes'
import { formatPhone, formatDate } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'

interface LeadCardProps {
  lead: Lead
  onConvert: (lead: Lead) => void
  onLost: (lead: Lead) => void
}

export function LeadCard({ lead, onConvert, onLost }: LeadCardProps) {
  return (
    <div className="bg-white border border-[#E3EAE5] rounded-md p-3 shadow-xs space-y-2 hover:border-[#BBDCCB] transition-colors select-none">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xs font-semibold text-[#1E2B24] truncate">
          {lead.fullName}
        </h3>
        <span className="text-[10px] bg-[#EFF7F1] text-[#176446] border border-[#DDEEE3] px-1.5 py-0.5 rounded font-medium shrink-0 truncate max-w-[110px]">
          {lead.courseInterest}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-[#65776C]">
        <Phone className="w-3 h-3 text-[#8B9C91]" />
        <span>{formatPhone(lead.phone)}</span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-[#8B9C91] pt-1">
        <span>Манба: {lead.source}</span>
        <div className="flex items-center gap-1">
          <Calendar className="w-2.5 h-2.5" />
          <span>{formatDate(lead.createdAt)}</span>
        </div>
      </div>

      {lead.stage !== 'Converted' && lead.stage !== 'Lost' && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-[#F0F4F1]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onConvert(lead)}
            className="flex-1 text-[10px] min-h-[26px] py-0 px-2"
          >
            <span>Талабага</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLost(lead)}
            className="text-[10px] text-[#BE123C] hover:bg-[#FFF1F2] min-h-[26px] py-0 px-2"
          >
            <XCircle className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
