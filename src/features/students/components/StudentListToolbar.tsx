import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { SearchInput } from '@/components/forms/SearchInput'
import { SelectInput } from '@/components/forms/SelectInput'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useBranchOptions } from '@/features/branches/hooks/useBranches'
import { STUDENT_STATUS_VALUES, type StudentStatus } from '../types/studentTypes'

interface StudentListToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status?: StudentStatus
  onStatusChange: (status?: StudentStatus) => void
  /** Bo'sh satr — barcha (ko'rinadigan) filiallar. */
  branchId: string
  onBranchChange: (branchId: string) => void
}

const tabClass = (isActive: boolean) =>
  cn(
    'px-2.5 py-1 rounded-md text-2xs font-medium transition-colors whitespace-nowrap',
    isActive ? 'bg-primary text-white' : 'bg-canvas text-caption hover:bg-primary-soft'
  )

export function StudentListToolbar({ search, onSearchChange, status, onStatusChange, branchId, onBranchChange }: StudentListToolbarProps) {
  const { t } = useTranslation()
  const canViewBranches = useAuthStore((state) => state.hasPermission(PERMISSIONS.BRANCHES.VIEW))
  const { data: branches = [] } = useBranchOptions(canViewBranches)

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-surface p-3 rounded-lg border border-border shadow-xs">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <SearchInput value={search} onChange={onSearchChange} placeholder={t.students.searchPlaceholder} className="sm:w-80" />
        {branches.length > 0 && (
          <SelectInput
            value={branchId}
            onChange={(e) => onBranchChange(e.target.value)}
            aria-label={t.layout.branchLabel}
            className="sm:w-56 min-h-9"
          >
            <option value="">{t.layout.allBranches}</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </SelectInput>
        )}
      </div>

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
