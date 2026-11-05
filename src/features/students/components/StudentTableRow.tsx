import { Link, generatePath } from 'react-router-dom'
import { ChevronRight, Coins, PauseCircle, PlayCircle, Trash2, UserPlus } from 'lucide-react'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/routes/paths'
import { useTranslation } from '@/i18n'
import { formatCurrency, formatPhone } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import { STUDENT_STATUS, type StudentListItem } from '../types/studentTypes'
import { StudentStatusBadge } from './StudentStatusBadge'

export interface StudentRowActions {
  onEnroll: (student: StudentListItem) => void
  onFreeze: (student: StudentListItem) => void
  onUnfreeze: (student: StudentListItem) => void
  onDelete: (student: StudentListItem) => void
}

const ICON_BUTTON = 'p-1 rounded text-caption transition-colors'

export function StudentTableRow({ student, onEnroll, onFreeze, onUnfreeze, onDelete }: StudentRowActions & { student: StudentListItem }) {
  const { t } = useTranslation()
  const profilePath = generatePath(ROUTES.STUDENTS.DETAIL, { id: student.id })
  const isFrozen = student.status === STUDENT_STATUS.Frozen

  return (
    <tr className="hover:bg-surface-muted transition-colors">
      <td className="py-3.5 px-4">
        <Link to={profilePath} className="font-bold text-heading hover:text-primary transition-colors">
          {student.fullName}
        </Link>
        <p className="text-2xs text-caption mt-0.5 tabular-nums">{formatPhone(student.phone)}</p>
      </td>
      <td className="py-3.5 px-4">
        {student.primaryGroup ? (
          <span className="font-medium bg-primary-soft text-primary px-2 py-0.5 rounded text-2xs">{student.primaryGroup}</span>
        ) : (
          <span className="text-subtle text-2xs">{t.students.noGroup}</span>
        )}
      </td>
      <td className="py-3.5 px-4">
        <span className={cn('font-semibold tabular-nums', student.balance < 0 ? 'text-debt-ink' : 'text-success-ink')}>
          {formatCurrency(student.balance)}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1 font-semibold text-warning-deep tabular-nums">
          <Coins className="w-3.5 h-3.5 text-warning" />
          <span>{student.coinsBalance}</span>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <StudentStatusBadge status={student.status} />
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center justify-end gap-1">
          <PermissionGuard permission={PERMISSIONS.GROUPS.UPDATE}>
            <button type="button" onClick={() => onEnroll(student)} title={t.students.actions.enroll} aria-label={t.students.actions.enroll} className={cn(ICON_BUTTON, 'text-primary hover:bg-primary-soft')}>
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.STUDENTS.FREEZE}>
            {isFrozen ? (
              <button type="button" onClick={() => onUnfreeze(student)} title={t.students.actions.unfreeze} aria-label={t.students.actions.unfreeze} className={cn(ICON_BUTTON, 'hover:text-success-ink hover:bg-success-soft')}>
                <PlayCircle className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button type="button" onClick={() => onFreeze(student)} title={t.students.actions.freeze} aria-label={t.students.actions.freeze} className={cn(ICON_BUTTON, 'hover:text-warning-deep hover:bg-warning-tint')}>
                <PauseCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.STUDENTS.DELETE}>
            <button type="button" onClick={() => onDelete(student)} title={t.common.delete} aria-label={t.common.delete} className={cn(ICON_BUTTON, 'hover:text-debt-ink hover:bg-debt-soft')}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </PermissionGuard>
          <Link to={profilePath} title={t.students.actions.openProfile} aria-label={t.students.actions.openProfile} className={cn(ICON_BUTTON, 'hover:text-primary hover:bg-divider')}>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </td>
    </tr>
  )
}
