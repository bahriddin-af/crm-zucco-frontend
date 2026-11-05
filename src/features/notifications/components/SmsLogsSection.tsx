import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { useTranslation } from '@/i18n'
import { formatDate, formatPhone, formatTime } from '@/utils/formatters'
import { SectionCard } from '@/components/ui/SectionCard'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useSmsLogs } from '../hooks/useSms'
import { SmsLogsToolbar } from './SmsLogsToolbar'
import { SMS_DELIVERY_STATUS, SMS_LOGS_PAGE_SIZE, type SmsDeliveryStatus } from '../types/smsTypes'

const STATUS_BADGE: Record<SmsDeliveryStatus, 'accent' | 'success' | 'danger' | 'warning'> = {
  [SMS_DELIVERY_STATUS.Pending]: 'accent',
  [SMS_DELIVERY_STATUS.Sent]: 'success',
  [SMS_DELIVERY_STATUS.Delivered]: 'success',
  [SMS_DELIVERY_STATUS.Failed]: 'danger',
  [SMS_DELIVERY_STATUS.Unknown]: 'warning',
}

/** SMS jurnali: eng yangisi birinchi, qidiruv va holat filtri bilan. */
export function SmsLogsSection() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<SmsDeliveryStatus | undefined>()
  const debouncedSearch = useDebouncedValue(search.trim())
  const { data, isLoading, isError, error, refetch } = useSmsLogs({
    page,
    pageSize: SMS_LOGS_PAGE_SIZE,
    search: debouncedSearch || undefined,
    status,
  })

  const changeSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const changeStatus = (value: SmsDeliveryStatus | undefined) => {
    setStatus(value)
    setPage(1)
  }

  return (
    <SectionCard title={t.sms.logsTitle}>
      <SmsLogsToolbar search={search} onSearchChange={changeSearch} status={status} onStatusChange={changeStatus} />
      {isLoading && <ListSkeleton rows={6} rowClassName="h-12" />}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {data && data.items.length === 0 && <EmptyState icon={<MessageSquare className="w-5 h-5" />} title={t.sms.emptyLogs} />}
      {data && data.items.length > 0 && (
        <>
          <ul className="divide-y divide-divider">
            {data.items.map((log) => (
              <li key={log.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-heading tabular-nums">
                    {formatPhone(log.recipientPhone)}
                    <span className="ml-2 text-2xs font-normal text-caption">{t.sms.triggers[log.trigger]}</span>
                  </p>
                  <p className="text-2xs text-copy mt-0.5 line-clamp-2">{log.message}</p>
                  <p className="text-3xs text-subtle mt-0.5 tabular-nums">
                    {formatDate(log.sentAt)} {formatTime(log.sentAt)}
                  </p>
                </div>
                <Badge variant={STATUS_BADGE[log.status]}>{t.sms.statuses[log.status]}</Badge>
              </li>
            ))}
          </ul>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </SectionCard>
  )
}
