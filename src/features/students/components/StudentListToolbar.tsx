import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { SearchInput } from '@/components/forms/SearchInput'
import { STUDENT_STATUS_VALUES, type StudentStatus } from '../types/studentTypes'

interface StudentListToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status?: StudentStatus
  onStatusChange: (status?: StudentStatus) => void
}

const tabClass = (isActive: boolean) =>
  cn(
    'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap',
    isActive ? 'bg-primary text-white' : 'bg-canvas text-caption hover:bg-primary-soft'
  )

export function StudentListToolbar({ search, onSearchChange, status, onStatusChange }: StudentListToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-border shadow-xs">
      <SearchInput value={search} onChange={onSearchChange} placeholder={t.students.searchPlaceholder} className="sm:w-80" />

      <div role="tablist" aria-label={t.students.statusFilter} className="flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          role="tab"
          aria-selected={status === undefined}
          onClick={() => onStatusChange(undefined)}
          className={tabClass(status === undefined)}
        >
          {t.common.all}
        </button>
        {STUDENT_STATUS_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={status === value}
            onClick={() => onStatusChange(value)}
            className={tabClass(status === value)}
          >
            {t.students.statuses[value]}
          </button>
        ))}
      </div>
    </div>
  )
}
