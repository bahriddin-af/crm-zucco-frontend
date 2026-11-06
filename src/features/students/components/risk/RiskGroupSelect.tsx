import { SelectInput } from '@/components/forms/SelectInput'
import { OPTIONS_PAGE_SIZE } from '@/constants/pagination'
import { useTranslation } from '@/i18n'
import { useGroupsList } from '@/features/groups/hooks/useGroups'

interface RiskGroupSelectProps {
  /** Bo'sh satr — barcha guruhlar. */
  value: string
  onChange: (groupId: string) => void
}

/** Guruh filtri. `groups.view` ruxsati bo'lgandagina chiziladi (so'rov ham shundagina yuboriladi). */
export function RiskGroupSelect({ value, onChange }: RiskGroupSelectProps) {
  const { t } = useTranslation()
  const { data } = useGroupsList({ pageSize: OPTIONS_PAGE_SIZE })
  const groups = data?.items ?? []

  return (
    <SelectInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={t.risk.groupLabel}
      className="sm:w-56 min-h-9"
    >
      <option value="">{t.risk.allGroups}</option>
      {groups.map((group) => (
        <option key={group.id} value={group.id}>
          {group.courseName} · {group.name}
        </option>
      ))}
    </SelectInput>
  )
}
