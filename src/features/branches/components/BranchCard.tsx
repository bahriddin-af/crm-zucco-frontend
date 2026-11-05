import { DoorClosed, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { formatPhone } from '@/utils/formatters'
import { BRANCH_STATUS, type BranchListItem } from '../types/branchTypes'

interface BranchCardProps {
  branch: BranchListItem
  isSelected: boolean
  onSelect: (branch: BranchListItem) => void
  onEdit: (branch: BranchListItem) => void
  onDelete: (branch: BranchListItem) => void
}

export function BranchCard({ branch, isSelected, onSelect, onEdit, onDelete }: BranchCardProps) {
  const { t } = useTranslation()

  return (
    <article
      className={cn(
        'bg-white border rounded-lg p-4 shadow-xs space-y-3 transition-colors',
        isSelected ? 'border-primary ring-2 ring-primary-ring' : 'border-border hover:border-primary-line'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button type="button" className="text-left cursor-pointer" onClick={() => onSelect(branch)}>
          <h3 className="text-sm font-bold text-heading">{branch.name}</h3>
          {branch.address && <p className="text-xs text-caption mt-0.5">{branch.address}</p>}
          {branch.phone && <p className="text-[11px] text-subtle mt-0.5 tabular-nums">{formatPhone(branch.phone)}</p>}
        </button>
        <div className="flex flex-col items-end gap-1">
          {branch.isMain && <Badge variant="accent">{t.branches.mainBadge}</Badge>}
          {branch.status === BRANCH_STATUS.Inactive && <Badge>{t.branches.statuses[branch.status]}</Badge>}
        </div>
      </div>

      <div className="pt-3 border-t border-divider flex items-center justify-between text-xs text-copy-strong">
        <button type="button" className="flex items-center gap-1.5 cursor-pointer" onClick={() => onSelect(branch)}>
          <DoorClosed className="w-3.5 h-3.5 text-primary" />
          <span>{interpolate(t.branches.roomCount, { count: branch.roomCount })}</span>
        </button>
        <div className="flex items-center gap-1">
          <PermissionGuard permission={PERMISSIONS.BRANCHES.UPDATE}>
            <Button variant="ghost" size="icon" aria-label={t.branches.editBranch} onClick={() => onEdit(branch)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.BRANCHES.DELETE}>
            <Button variant="ghost" size="icon" aria-label={t.common.delete} onClick={() => onDelete(branch)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </PermissionGuard>
        </div>
      </div>
    </article>
  )
}
