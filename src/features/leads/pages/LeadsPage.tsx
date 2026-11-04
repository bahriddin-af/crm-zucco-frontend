import { useState, useMemo } from 'react'
import { Plus, Search, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { LeadCard } from '../components/LeadCard'
import { LeadModal } from '../components/LeadModal'
import { LeadConvertModal } from '../components/LeadConvertModal'
import { LeadLostModal } from '../components/LeadLostModal'
import {
  useKanbanBoard,
  useLeadStages,
  useMoveLeadStage,
} from '../hooks/useLeads'
import type { LeadListItem } from '../types/leadTypes'

export function LeadsPage() {
  const [search, setSearch] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedStageForCreate, setSelectedStageForCreate] = useState<string | undefined>()
  const [selectedLeadForConvert, setSelectedLeadForConvert] = useState<LeadListItem | null>(null)
  const [selectedLeadForLost, setSelectedLeadForLost] = useState<LeadListItem | null>(null)

  // Live Kanban Query from Backend API
  const { data: kanbanColumns = [], isLoading, isError, refetch } = useKanbanBoard()
  const { data: stages = [] } = useLeadStages()
  const moveStageMutation = useMoveLeadStage()

  // Flattened total leads count
  const totalLeads = useMemo(() => {
    return kanbanColumns.reduce((acc, col) => acc + col.totalLeads, 0)
  }, [kanbanColumns])

  const handleOpenCreate = (stageId?: string) => {
    setSelectedStageForCreate(stageId)
    setIsCreateModalOpen(true)
  }

  const handleMoveStage = (leadId: string, targetStageId: string) => {
    moveStageMutation.mutate({ leadId, targetStageId })
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Лидлар воронкаси (Kanban)
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Янги мурожаатлар, босқичлар, қўнғироқлар ва талабага айлантириш
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            title="Янгилаш"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenCreate()}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Янги лид қўшиш</span>
          </Button>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E3EAE5] shadow-xs">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B9C91]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Исм, телефон ёки курс бўйича..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F6F8F7] border border-[#E3EAE5] rounded-md text-[#1E2B24] placeholder:text-[#8B9C91] focus:outline-none focus:ring-1 focus:ring-[#146B52]"
          />
        </div>
        <div className="text-xs text-[#65776C]">
          Воронкадаги жами лидлар: <strong className="text-[#1E2B24]">{totalLeads}</strong>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="w-72 shrink-0 bg-[#F6F8F7] rounded-lg p-3 space-y-3 border border-[#E3EAE5]"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-6 rounded-full" />
              </div>
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center space-y-3">
          <p className="text-xs text-red-600">Воронка маълумотларини юклашда хатолик юз берди</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Қайта уриниш
          </Button>
        </div>
      )}

      {/* Kanban Board */}
      {!isLoading && !isError && (
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px] select-none">
          {kanbanColumns.map((col) => {
            const query = search.toLowerCase()
            const filteredLeads = col.leads.filter(
              (l) =>
                l.fullName.toLowerCase().includes(query) ||
                l.phone.includes(query) ||
                (l.courseName && l.courseName.toLowerCase().includes(query))
            )

            const borderColor = col.colorHex || '#146B52'

            return (
              <div
                key={col.stageId}
                className="w-72 shrink-0 bg-[#F6F8F7] rounded-lg border border-[#E3EAE5] flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div
                  className="p-3 border-b border-[#E3EAE5] bg-white rounded-t-lg flex items-center justify-between"
                  style={{ borderTop: `3px solid ${borderColor}` }}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[#1E2B24]">{col.stageName}</h3>
                    <span className="text-[10px] font-bold text-[#4D6255] bg-[#E8F3ED] px-1.5 py-0.2 rounded-full">
                      {col.totalLeads}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenCreate(col.stageId)}
                    title="Ушбу босқичга лид қўшиш"
                    className="w-5 h-5 rounded hover:bg-[#F0F4F1] flex items-center justify-center text-[#65776C]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Column Body / Cards List */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {filteredLeads.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#8B9C91]">
                      Лидлар йўқ
                    </div>
                  ) : (
                    filteredLeads.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        stages={stages}
                        onMoveStage={handleMoveStage}
                        onConvert={(l) => setSelectedLeadForConvert(l)}
                        onLost={(l) => setSelectedLeadForLost(l)}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <LeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultStageId={selectedStageForCreate}
      />

      <LeadConvertModal
        isOpen={Boolean(selectedLeadForConvert)}
        onClose={() => setSelectedLeadForConvert(null)}
        lead={selectedLeadForConvert}
      />

      <LeadLostModal
        isOpen={Boolean(selectedLeadForLost)}
        onClose={() => setSelectedLeadForLost(null)}
        lead={selectedLeadForLost}
      />
    </div>
  )
}
