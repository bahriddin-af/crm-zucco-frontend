import { Building2 } from 'lucide-react'
import { PERMISSIONS } from '@/constants/permissions'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n'
import { useBranchOptions } from '@/features/branches/hooks/useBranches'

/**
 * Faol filial (yangi yozuvlar uchun standart filial). Ro'yxat faqat `branches.view` ruxsati bilan olinadi;
 * ruxsat yoki filial bo'lmasa tanlagich ko'rsatilmaydi.
 */
export function BranchSwitcher() {
  const { t } = useTranslation()
  const canViewBranches = useAuthStore((state) => state.hasPermission(PERMISSIONS.BRANCHES.VIEW))
  const activeBranchId = useAuthStore((state) => state.activeBranchId)
  const setActiveBranchId = useAuthStore((state) => state.setActiveBranchId)
  const { data: branches = [] } = useBranchOptions(canViewBranches)

  if (!canViewBranches || branches.length === 0) return null

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-canvas border border-border text-xs font-medium text-secondary-ink">
      <Building2 className="w-3.5 h-3.5 text-primary" />
      <select
        value={activeBranchId ?? ''}
        onChange={(e) => setActiveBranchId(e.target.value)}
        aria-label={t.layout.branchLabel}
        className="bg-transparent border-none text-xs font-medium text-secondary-ink focus:outline-none cursor-pointer max-w-[200px]"
      >
        <option value="">{t.layout.allBranches}</option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  )
}
