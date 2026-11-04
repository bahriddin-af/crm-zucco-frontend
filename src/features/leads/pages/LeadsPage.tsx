import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LeadCard } from '../components/LeadCard'
import { LeadConvertModal } from '../components/LeadConvertModal'
import { LeadLostModal } from '../components/LeadLostModal'
import { useTranslation } from '@/i18n'
import type { Lead, LeadStage } from '../types/leadTypes'

const INITIAL_LEADS: Lead[] = [
  {
    id: 'l1',
    fullName: 'Сардор Раҳимов',
    phone: '998901234567',
    courseInterest: 'IELTS Foundation',
    stage: 'New',
    source: 'Instagram',
    createdAt: '2026-11-03T10:00:00Z',
  },
  {
    id: 'l2',
    fullName: 'Мадина Аҳмедова',
    phone: '998939876543',
    courseInterest: 'General English',
    stage: 'New',
    source: 'Telegram',
    createdAt: '2026-11-03T09:30:00Z',
  },
  {
    id: 'l3',
    fullName: 'Жавоҳир Бозоров',
    phone: '998974567890',
    courseInterest: 'Frontend React',
    stage: 'Contacted',
    source: 'Тавсия',
    createdAt: '2026-11-02T16:00:00Z',
  },
  {
    id: 'l4',
    fullName: 'Нодира Тоҳирова',
    phone: '998993214567',
    courseInterest: 'IELTS Intensive',
    stage: 'TrialScheduled',
    source: 'Instagram',
    createdAt: '2026-11-01T14:00:00Z',
    trialDate: '2026-11-04T15:00:00Z',
  },
  {
    id: 'l5',
    fullName: 'Бобур Шарипов',
    phone: '998912348765',
    courseInterest: 'Frontend React',
    stage: 'TrialAttended',
    source: 'Сайт',
    createdAt: '2026-10-30T12:00:00Z',
  },
  {
    id: 'l6',
    fullName: 'Дилдора Саидова',
    phone: '998946781234',
    courseInterest: 'IELTS Foundation',
    stage: 'Converted',
    source: 'Instagram',
    createdAt: '2026-10-28T11:00:00Z',
  },
]

export function LeadsPage() {
  const { t } = useTranslation()
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS)
  const [search, setSearch] = useState('')
  const [selectedLeadForConvert, setSelectedLeadForConvert] = useState<Lead | null>(null)
  const [selectedLeadForLost, setSelectedLeadForLost] = useState<Lead | null>(null)

  const columns: { id: LeadStage; title: string; color: string }[] = [
    { id: 'New', title: t.leads.stages.new, color: 'border-t-[#2F8060]' },
    { id: 'Contacted', title: t.leads.stages.contacted, color: 'border-t-[#32856B]' },
    { id: 'TrialScheduled', title: t.leads.stages.trialScheduled, color: 'border-t-[#4F9270]' },
    { id: 'TrialAttended', title: t.leads.stages.trialAttended, color: 'border-t-[#F59E0B]' },
    { id: 'WaitingList', title: t.leads.stages.waitingList, color: 'border-t-[#65776C]' },
    { id: 'Converted', title: t.leads.stages.converted, color: 'border-t-[#059669]' },
  ]

  const filteredLeads = leads.filter(
    (l) =>
      l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.courseInterest.toLowerCase().includes(search.toLowerCase())
  )

  const handleConvertSuccess = () => {
    if (!selectedLeadForConvert) return
    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLeadForConvert.id ? { ...l, stage: 'Converted' } : l
      )
    )
  }

  const handleLostSuccess = () => {
    if (!selectedLeadForLost) return
    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLeadForLost.id ? { ...l, stage: 'Lost' } : l
      )
    )
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            {t.leads.title}
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            {t.leads.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" />
            <span>{t.leads.addNew}</span>
          </Button>
        </div>
      </div>

      {/* Toolbar / Search / Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E3EAE5] shadow-xs">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B9C91]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.leads.searchPlaceholder}
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F6F8F7] border border-[#E3EAE5] rounded-md text-[#1E2B24] placeholder:text-[#8B9C91] focus:outline-none focus:ring-1 focus:ring-[#146B52]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#65776C]">
          <Filter className="w-3.5 h-3.5" />
          <span>{t.leads.totalLeads}: <strong className="text-[#1E2B24] font-semibold">{filteredLeads.length}</strong></span>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-start overflow-x-auto pb-4">
        {columns.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.stage === col.id)
          return (
            <div
              key={col.id}
              className={`bg-[#F0F4F1] border border-[#E8EFEB] rounded-lg p-2.5 min-w-[210px] space-y-2 border-t-4 ${col.color}`}
            >
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold text-[#344B3E]">
                  {col.title}
                </h2>
                <span className="text-[11px] font-bold text-[#65776C] bg-white px-1.5 py-0.2 rounded border border-[#E3EAE5]">
                  {colLeads.length}
                </span>
              </div>

              <div className="space-y-2 min-h-[400px]">
                {colLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onConvert={(l) => setSelectedLeadForConvert(l)}
                    onLost={(l) => setSelectedLeadForLost(l)}
                  />
                ))}

                {colLeads.length === 0 && (
                  <div className="py-8 text-center text-[11px] text-[#8B9C91]">
                    {t.common.noData}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Convert Modal */}
      <LeadConvertModal
        lead={selectedLeadForConvert}
        isOpen={Boolean(selectedLeadForConvert)}
        onClose={() => setSelectedLeadForConvert(null)}
        onSuccess={handleConvertSuccess}
      />

      {/* Lost Modal */}
      <LeadLostModal
        lead={selectedLeadForLost}
        isOpen={Boolean(selectedLeadForLost)}
        onClose={() => setSelectedLeadForLost(null)}
        onSuccess={handleLostSuccess}
      />
    </div>
  )
}
