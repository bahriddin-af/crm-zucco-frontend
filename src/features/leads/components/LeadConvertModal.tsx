import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import { useConvertLead } from '../hooks/useLeads'
import type { LeadListItem } from '../types/leadTypes'

interface LeadConvertModalProps {
  isOpen: boolean
  onClose: () => void
  lead: LeadListItem | null
}

export function LeadConvertModal({ isOpen, onClose, lead }: LeadConvertModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('')
  const [joinedDate, setJoinedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )

  const { data: groupsData } = useGroupsList()
  const groups = groupsData?.items || []

  const convertMutation = useConvertLead(() => {
    onClose()
  })

  if (!lead) return null

  const handleConvert = () => {
    convertMutation.mutate({
      leadId: lead.id,
      groupId: selectedGroupId || undefined,
      joinedDate,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Лидни талабага айлантириш"
      description={`"${lead.fullName}" ни ўқув маркази талабалари қаторига қўшиш`}
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose}>
            Бекор қилиш
          </Button>
          <Button
            variant="primary"
            size="md"
            isLoading={convertMutation.isPending}
            onClick={handleConvert}
          >
            Талабага айлантириш
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-3 bg-[#F6F8F7] rounded-lg border border-[#E3EAE5] text-xs space-y-1">
          <p className="font-semibold text-[#1E2B24]">{lead.fullName}</p>
          <p className="text-[#65776C]">Телефон: {lead.phone}</p>
          {lead.courseName && (
            <p className="text-[#146B52] font-medium">Қизиққан курс: {lead.courseName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Ўқув гуруҳига бириктириш (ихтиёрий)
          </label>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="flex w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#418A66]"
          >
            <option value="">Гуруҳсиз сақлаш (Кейинроқ қўшиш)</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} — {g.courseName} ({g.teacherName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1E2B24] mb-1">
            Дарсга қўшилиш санаси
          </label>
          <Input
            type="date"
            value={joinedDate}
            onChange={(e) => setJoinedDate(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  )
}
