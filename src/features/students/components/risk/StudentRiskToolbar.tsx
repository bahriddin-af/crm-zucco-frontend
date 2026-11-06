import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { SearchInput } from '@/components/forms/SearchInput'
import { SelectInput } from '@/components/forms/SelectInput'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useBranchOptions } from '@/features/branches/hooks/useBranches'
import { RISK_LEVEL_VALUES, type RiskLevel } from '../../types/studentRiskTypes'
import { RiskGroupSelect } from './RiskGroupSelect'

export interface StudentRiskFilterState {
  search: string
  level?: RiskLevel
  /** Bo'sh satr — barcha (ko'rinadigan) filiallar / guruhlar. */
  branchId: string
  groupId: string
}

interface StudentRiskToolbarProps {
  filters: StudentRiskFilterState
  onChange: (patch: Partial<StudentRiskFilterState>) => void
}

const tabClass = (isActive: boolean) =>
  cn(
    'px-2.5 py-1 rounded-md text-2xs font-medium transition-colors whitespace-nowrap',
    isActive ? 'bg-primary text-white' : 'bg-canvas text-caption hover:bg-primary-soft'
  )

export function StudentRiskToolbar({ filters, onChange }: StudentRiskToolbarProps) {
  const { t } = useTranslation()
  const canViewBranches = useAuthStore((state) => state.hasPermission(PERMISSIONS.BRANCHES.VIEW))
  const { data: branches = [] } = useBranchOptions(canViewBranches)

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-surface p-3 rounded-lg border border-border shadow-xs">
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:items-center">
        <SearchInput
          value={filters.search}
          onChange={(search) => onChange({ search })}
          placeholder={t.risk.searchPlaceholder}
          className="sm:w-72"
        />
        {branches.length > 0 && (
          <SelectInput
            value={filters.branchId}
            onChange={(e) => onChange({ branchId: e.target.value })}
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
        <PermissionGuard permission={PERMISSIONS.GROUPS.VIEW}>
          <RiskGroupSelect value={filters.groupId} onChange={(groupId) => onChange({ groupId })} />
        </PermissionGuard>
      </div>

      <div role="tablist" aria-label={t.risk.levelFilter} className="flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          role="tab"
          aria-selected={filters.level === undefined}
          onClick={() => onChange({ level: undefined })}
          className={tabClass(filters.level === undefined)}
        >
          {t.common.all}
        </button>
        {RISK_LEVEL_VALUES.map((level) => (
          <button
            key={level}
            type="button"
            role="tab"
            aria-selected={filters.level === level}
            onClick={() => onChange({ level })}
            className={tabClass(filters.level === level)}
          >
            {t.risk.levels[level]}
          </button>
        ))}
      </div>
    </div>
  )
}
