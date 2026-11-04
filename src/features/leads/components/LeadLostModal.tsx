import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  LOST_REASON,
  LOST_REASON_LABELS,
  type LeadListItem,
} from '../types/leadTypes'
import { useMarkLeadLost } from '../hooks/useLeads'

interface LeadLostModalProps {
  isOpen: boolean
  onClose: () => void
  lead: LeadListItem | null
}

export function LeadLostModal({ isOpen, onClose, lead }: LeadLostModalProps) {
  const [reason, setReason] = useState<number>(LOST_REASON.TooExpensive)
  const [details, setDetails] = useState<string>('')

  const lostMutation = useMarkLeadLost(() => {
    onClose()
  })

  if (!lead) return null

  const handleLost = () => {
    lostMutation.mutate({
      leadId: lead.id,
      reason,
      details: details || undefined,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Лидни йўқотилган/архивга белгилаш"
      description={`"${lead.fullName}" нинг рад этилиш сабабини кўрсатинг`}
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button
            variant="danger"
            size="md"
            isLoading={lostMutation.isPending}
            onClick={handleLost}
          >
            Рад этишни тасдиқлаш
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Рад этиш сабаби <span className="text-red-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(Number(e.target.value))}
            className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
          >
            {Object.entries(LOST_REASON_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Қўшимча изоҳ (ихтиёрий)
          </label>
          <Input
            placeholder="Нима сабабдан рад этилди?.."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  )
}
