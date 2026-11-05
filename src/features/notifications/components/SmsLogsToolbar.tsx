import { SearchInput } from '@/components/forms/SearchInput'
import { SelectInput } from '@/components/forms/SelectInput'
import { useTranslation } from '@/i18n'
import { SMS_DELIVERY_STATUS, type SmsDeliveryStatus } from '../types/smsTypes'

interface SmsLogsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: SmsDeliveryStatus | undefined
  onStatusChange: (status: SmsDeliveryStatus | undefined) => void
}

const STATUSES = Object.values(SMS_DELIVERY_STATUS)

const parseStatus = (value: string): SmsDeliveryStatus | undefined =>
  STATUSES.find((status) => String(status) === value)

/** SMS jurnali filtrlari: telefon/matn qidiruvi va yetkazish holati. */
export function SmsLogsToolbar({ search, onSearchChange, status, onStatusChange }: SmsLogsToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-3">
      <SearchInput value={search} onChange={onSearchChange} placeholder={t.sms.searchLogs} />
      <SelectInput
        aria-label={t.sms.allStatuses}
        className="sm:w-48"
        value={status === undefined ? '' : String(status)}
        onChange={(event) => onStatusChange(parseStatus(event.target.value))}
      >
        <option value="">{t.sms.allStatuses}</option>
        {STATUSES.map((value) => (
          <option key={value} value={value}>
            {t.sms.statuses[value]}
          </option>
        ))}
      </SelectInput>
    </div>
  )
}
