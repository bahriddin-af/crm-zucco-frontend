import { useState } from 'react'
import { UserSearch } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { CELL_CLASS, DataTable, type TableColumn } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListState } from '@/components/ui/ListState'
import { Pagination } from '@/components/ui/Pagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { interpolate, useTranslation } from '@/i18n'
import { formatDate, formatPhone } from '@/utils/formatters'
import { useLeadsList } from '../hooks/useLeads'
import { LEADS_PAGE_SIZE, type LeadListItem } from '../types/leadTypes'
import { LEAD_STATUS_VARIANT } from '../utils/leadStatus'

interface LeadsTableProps {
  search: string
  courseId: string
  onOpen: (lead: LeadListItem) => void
}

/**
 * Barcha lidlar (faol, talabaga aylangan, yo'qotilgan) — server tomonida qidiruv va sahifalash.
 * Filtr o'zgarganda sahifa 1 ga qaytadi (sahifa raqami filtr kaliti bilan birga saqlanadi, effect'siz).
 */
export function LeadsTable({ search, courseId, onOpen }: LeadsTableProps) {
  const { t } = useTranslation()
  const debouncedSearch = useDebouncedValue(search.trim())
  const filterKey = `${debouncedSearch}|${courseId}`
  const [paging, setPaging] = useState({ filterKey, page: 1 })
  const page = paging.filterKey === filterKey ? paging.page : 1
  const setPage = (next: number) => setPaging({ filterKey, page: next })
  const leadsQuery = useLeadsList({
    page,
    pageSize: LEADS_PAGE_SIZE,
    search: debouncedSearch || undefined,
    courseId: courseId || undefined,
  })
  const leads = leadsQuery.data?.items ?? []

  const columns: TableColumn[] = [
    { key: 'client', label: t.leads.table.client },
    { key: 'stage', label: t.leads.detail.stage },
    { key: 'status', label: t.leads.detail.status },
    { key: 'course', label: t.leads.detail.course },
    { key: 'source', label: t.leads.detail.source },
    { key: 'createdAt', label: t.leads.detail.createdAt, align: 'right' },
  ]

  return (
    <div className="bg-surface border border-border rounded-lg shadow-xs p-4">
      <ListState
        isLoading={leadsQuery.isLoading}
        isError={leadsQuery.isError}
        error={leadsQuery.error}
        onRetry={() => void leadsQuery.refetch()}
        isEmpty={leads.length === 0}
        empty={
          <EmptyState
            title={t.leads.table.emptyTitle}
            description={t.leads.table.emptyDescription}
            icon={<UserSearch className="w-5 h-5" />}
          />
        }
      >
        <DataTable columns={columns}>
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-surface-muted transition-colors">
              <td className={CELL_CLASS}>
                <button
                  type="button"
                  onClick={() => onOpen(lead)}
                  className="font-semibold text-heading hover:text-primary transition-colors cursor-pointer text-left"
                >
                  {lead.fullName}
                </button>
                <p className="text-2xs text-caption tabular-nums">{formatPhone(lead.phone)}</p>
              </td>
              <td className={CELL_CLASS}>{lead.stageName}</td>
              <td className={CELL_CLASS}>
                <Badge variant={LEAD_STATUS_VARIANT[lead.status]}>{t.leads.statuses[lead.status]}</Badge>
              </td>
              <td className={CELL_CLASS}>{lead.courseName ?? '—'}</td>
              <td className={CELL_CLASS}>{lead.sourceName ?? '—'}</td>
              <td className={`${CELL_CLASS} text-right tabular-nums`}>{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </DataTable>
        <div className="flex items-center justify-between gap-3">
          <span className="text-2xs text-caption pt-3">
            {interpolate(t.leads.table.total, { count: leadsQuery.data?.totalCount ?? 0 })}
          </span>
          <Pagination page={page} totalPages={leadsQuery.data?.totalPages ?? 1} onPageChange={setPage} />
        </div>
      </ListState>
    </div>
  )
}
