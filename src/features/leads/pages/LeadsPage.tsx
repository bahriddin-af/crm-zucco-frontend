import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n'
import { PageHeader } from '@/components/ui/PageHeader'
import { LeadKanbanBoard } from '../components/LeadKanbanBoard'
import { LeadsToolbar } from '../components/LeadsToolbar'
import { LeadsTable } from '../components/LeadsTable'
import { LeadsViewToggle } from '../components/LeadsViewToggle'
import { LEADS_VIEW, type LeadsView } from '../constants/leadsView'
import { LeadModal } from '../components/LeadModal'
import { LeadConvertModal } from '../components/LeadConvertModal'
import { LeadLostModal } from '../components/LeadLostModal'
import { LeadDetailModal } from '../components/LeadDetailModal'
import { useKanbanBoard, useMoveLeadStage } from '../hooks/useLeads'
import { LEAD_STAGE_TYPE, type KanbanFilters, type LeadListItem, type LeadResponse } from '../types/leadTypes'

type LeadDialog =
  | { kind: 'create'; stageId?: string }
  | { kind: 'edit'; lead: LeadResponse }
  | { kind: 'convert'; lead: LeadListItem }
  | { kind: 'lost'; lead: LeadListItem }
  | { kind: 'detail'; leadId: string }
  | null

export function LeadsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const canUpdate = useAuthStore((state) => state.hasPermission(PERMISSIONS.LEADS.UPDATE))
  const canConvert = useAuthStore((state) => state.hasPermission(PERMISSIONS.LEADS.CONVERT))
  const canCreate = useAuthStore((state) => state.hasPermission(PERMISSIONS.LEADS.CREATE))
  const [search, setSearch] = useState('')
  const [courseId, setCourseId] = useState('')
  const [dialog, setDialog] = useState<LeadDialog>(null)
  const [view, setView] = useState<LeadsView>(LEADS_VIEW.Kanban)
  const isKanban = view === LEADS_VIEW.Kanban
  const closeDialog = () => setDialog(null)

  const filters: KanbanFilters | undefined = courseId ? { courseId } : undefined
  const { data: columns = [], isLoading, error, refetch, isFetching } = useKanbanBoard(filters, isKanban)
  const moveStage = useMoveLeadStage(filters)
  const totalLeads = columns.reduce((sum, column) => sum + column.totalLeads, 0)

  /** Yakuniy bosqichga sudrash backend'ning maxsus amallari (konvertatsiya / yo'qotish) orqali bajariladi. */
  const handleMoveStage = (leadId: string, targetStageId: string) => {
    const target = columns.find((column) => column.stageId === targetStageId)
    const lead = columns.flatMap((column) => column.leads).find((item) => item.id === leadId)
    if (!target || !lead) return
    if (target.stageType === LEAD_STAGE_TYPE.Converted) {
      if (canConvert) setDialog({ kind: 'convert', lead })
      return
    }
    if (target.stageType === LEAD_STAGE_TYPE.Lost) {
      setDialog({ kind: 'lost', lead })
      return
    }
    moveStage.mutate({ leadId, targetStageId })
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.leads.title}
        subtitle={t.leads.subtitle}
        actions={
          <>
            <LeadsViewToggle value={view} onChange={setView} />
            <Button size="sm" onClick={() => void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS.ALL })} disabled={isFetching} title={t.common.refresh} aria-label={t.common.refresh}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <PermissionGuard permission={PERMISSIONS.LEADS.CREATE}>
              <Button variant="primary" size="sm" onClick={() => setDialog({ kind: 'create' })}>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.leads.addNew}</span>
              </Button>
            </PermissionGuard>
          </>
        }
      />

      <LeadsToolbar
        search={search}
        onSearchChange={setSearch}
        courseId={courseId}
        onCourseChange={setCourseId}
        totalLeads={isKanban ? totalLeads : undefined}
      />

      <ErrorBoundary>
        {isKanban ? (
          <LeadKanbanBoard
            columns={columns}
            isLoading={isLoading}
            error={error}
            onRetry={() => void refetch()}
            search={search}
            canCreate={canCreate}
            canUpdate={canUpdate}
            canConvert={canConvert}
            onCreate={(stageId) => setDialog({ kind: 'create', stageId })}
            onMoveStage={handleMoveStage}
            onConvert={(lead) => setDialog({ kind: 'convert', lead })}
            onLost={(lead) => setDialog({ kind: 'lost', lead })}
            onOpen={(lead) => setDialog({ kind: 'detail', leadId: lead.id })}
          />
        ) : (
          <LeadsTable search={search} courseId={courseId} onOpen={(lead) => setDialog({ kind: 'detail', leadId: lead.id })} />
        )}
      </ErrorBoundary>

      {dialog?.kind === 'create' && <LeadModal onClose={closeDialog} defaultStageId={dialog.stageId} />}
      {dialog?.kind === 'edit' && <LeadModal onClose={closeDialog} lead={dialog.lead} />}
      {dialog?.kind === 'convert' && <LeadConvertModal lead={dialog.lead} onClose={closeDialog} />}
      {dialog?.kind === 'lost' && <LeadLostModal lead={dialog.lead} onClose={closeDialog} />}
      {dialog?.kind === 'detail' && (
        <LeadDetailModal
          leadId={dialog.leadId}
          onClose={closeDialog}
          onEdit={(lead) => setDialog({ kind: 'edit', lead })}
        />
      )}
    </div>
  )
}
