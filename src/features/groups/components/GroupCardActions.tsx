import type { ReactNode } from 'react'
import { CalendarDays, Edit2, Trash2, Users } from 'lucide-react'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'

export type GroupAction = 'edit' | 'delete' | 'lessons' | 'students'

interface GroupCardActionsProps {
  onAction: (action: GroupAction) => void
}

interface IconActionProps {
  label: string
  onClick: () => void
  danger?: boolean
  children: ReactNode
}

function IconAction({ label, onClick, danger = false, children }: IconActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        'p-1.5 rounded text-caption transition-colors cursor-pointer',
        danger ? 'hover:text-debt-ink hover:bg-debt-soft' : 'hover:text-primary hover:bg-divider'
      )}
    >
      {children}
    </button>
  )
}

export function GroupCardActions({ onAction }: GroupCardActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label={t.groups.actionsMenu}>
      <PermissionGuard permission={PERMISSIONS.GROUPS.VIEW}>
        <IconAction label={t.groups.lessons} onClick={() => onAction('lessons')}>
          <CalendarDays className="w-3.5 h-3.5" />
        </IconAction>
        <IconAction label={t.groups.students} onClick={() => onAction('students')}>
          <Users className="w-3.5 h-3.5" />
        </IconAction>
      </PermissionGuard>
      <PermissionGuard permission={PERMISSIONS.GROUPS.UPDATE}>
        <IconAction label={t.groups.edit} onClick={() => onAction('edit')}>
          <Edit2 className="w-3.5 h-3.5" />
        </IconAction>
      </PermissionGuard>
      <PermissionGuard permission={PERMISSIONS.GROUPS.DELETE}>
        <IconAction label={t.groups.delete} onClick={() => onAction('delete')} danger>
          <Trash2 className="w-3.5 h-3.5" />
        </IconAction>
      </PermissionGuard>
    </div>
  )
}
