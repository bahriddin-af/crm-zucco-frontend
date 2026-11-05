import { Pencil } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { formatDate, formatPhone } from '@/utils/formatters'
import { useLeadDetail } from '../hooks/useLeads'
import { LEAD_STATUS, type LeadResponse } from '../types/leadTypes'
import { LeadActivityForm } from './LeadActivityForm'
import { LeadActivityList } from './LeadActivityList'

interface LeadDetailModalProps {
  leadId: string
  onClose: () => void
  onEdit: (lead: LeadResponse) => void
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex justify-between gap-3 text-xs py-1 border-b border-divider last:border-none">
      <span className="text-caption">{label}</span>
      <span className="font-medium text-heading text-right break-words">{value}</span>
    </div>
  )
}

export function LeadDetailModal({ leadId, onClose, onEdit }: LeadDetailModalProps) {
  const { t } = useTranslation()
  const { data: lead, isLoading, error, refetch } = useLeadDetail(leadId)

  return (
    <Modal isOpen onClose={onClose} title={lead?.fullName ?? t.leads.detail.title} description={lead ? formatPhone(lead.phone) : undefined} maxWidth="lg">
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}
      {error && <ErrorState error={error} onRetry={() => void refetch()} />}
      {lead && (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <Badge variant={lead.status === LEAD_STATUS.Lost ? 'danger' : lead.status === LEAD_STATUS.Converted ? 'success' : 'accent'}>
              {t.leads.statuses[lead.status]}
            </Badge>
            <PermissionGuard permission={PERMISSIONS.LEADS.UPDATE}>
              <Button size="sm" onClick={() => onEdit(lead)}>
                <Pencil className="w-3.5 h-3.5" />
                <span>{t.leads.detail.edit}</span>
              </Button>
            </PermissionGuard>
          </div>

          <div>
            <InfoRow label={t.leads.detail.stage} value={lead.stageName} />
            <InfoRow label={t.leads.form.parentPhone} value={lead.parentPhone ? formatPhone(lead.parentPhone) : null} />
            <InfoRow label={t.leads.detail.course} value={lead.courseName} />
            <InfoRow label={t.leads.detail.source} value={lead.sourceName} />
            <InfoRow label={t.leads.detail.branch} value={lead.branchName} />
            <InfoRow label={t.leads.detail.assignedTo} value={lead.assignedToName} />
            <InfoRow label={t.leads.detail.note} value={lead.note} />
            <InfoRow label={t.leads.detail.createdAt} value={formatDate(lead.createdAt)} />
            {lead.status === LEAD_STATUS.Lost && (
              <InfoRow
                label={t.leads.detail.lostReason}
                value={[t.leads.lostReasons[lead.lostReason], lead.lostReasonDetails].filter(Boolean).join(' — ')}
              />
            )}
          </div>

          <ErrorBoundary>
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-heading">{t.leads.detail.activities}</h3>
              <PermissionGuard permission={PERMISSIONS.LEADS.UPDATE}>
                <LeadActivityForm leadId={lead.id} />
              </PermissionGuard>
              <LeadActivityList activities={lead.activities} />
            </div>
          </ErrorBoundary>
        </div>
      )}
    </Modal>
  )
}
