import { Coins, PauseCircle, Pencil, Phone, PlayCircle, Trash2, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency, formatDate, formatPhone } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import { STUDENT_STATUS, type StudentDetail } from '../types/studentTypes'
import { StudentStatusBadge } from './StudentStatusBadge'

const INITIALS_LENGTH = 2

interface StudentProfileHeaderProps {
  student: StudentDetail
  isUnfreezing: boolean
  onEdit: () => void
  onEnroll: () => void
  onFreeze: () => void
  onUnfreeze: () => void
  onDelete: () => void
}

export function StudentProfileHeader({ student, isUnfreezing, onEdit, onEnroll, onFreeze, onUnfreeze, onDelete }: StudentProfileHeaderProps) {
  const { t } = useTranslation()
  const isFrozen = student.status === STUDENT_STATUS.Frozen

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 shrink-0 rounded-full bg-primary-soft text-primary border border-primary-line flex items-center justify-center text-xl font-bold">
          {student.fullName.slice(0, INITIALS_LENGTH).toUpperCase()}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-lg font-bold text-heading">{student.fullName}</h1>
            <StudentStatusBadge status={student.status} />
          </div>
          <div className="flex items-center gap-2 text-xs text-caption">
            <Phone className="w-3.5 h-3.5 text-subtle" />
            <span className="tabular-nums font-medium">{formatPhone(student.phone)}</span>
          </div>
          {student.birthDate && (
            <p className="text-xs text-subtle">{interpolate(t.students.detail.birthDate, { date: formatDate(student.birthDate) })}</p>
          )}
          {student.address && <p className="text-xs text-subtle">{interpolate(t.students.detail.address, { address: student.address })}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="p-3 bg-canvas border border-border rounded-lg min-w-[140px]">
          <span className="block text-[10px] text-caption font-medium">{t.students.detail.balance}</span>
          <span className={cn('text-base font-bold tabular-nums', student.balance < 0 ? 'text-debt-ink' : 'text-success-ink')}>
            {formatCurrency(student.balance)}
          </span>
        </div>
        <div className="p-3 bg-canvas border border-border rounded-lg min-w-[120px]">
          <span className="block text-[10px] text-caption font-medium">{t.students.detail.coins}</span>
          <div className="flex items-center gap-1 text-base font-bold text-warning-deep tabular-nums">
            <Coins className="w-4 h-4 text-warning" />
            <span>{student.coinsBalance}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <PermissionGuard permission={PERMISSIONS.GROUPS.UPDATE}>
            <Button variant="primary" size="sm" onClick={onEnroll}>
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t.students.actions.enroll}</span>
            </Button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.STUDENTS.UPDATE}>
            <Button size="sm" onClick={onEdit}>
              <Pencil className="w-3.5 h-3.5" />
              <span>{t.common.edit}</span>
            </Button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.STUDENTS.FREEZE}>
            {isFrozen ? (
              <Button variant="outline" size="sm" isLoading={isUnfreezing} onClick={onUnfreeze}>
                <PlayCircle className="w-3.5 h-3.5" />
                <span>{t.students.actions.unfreeze}</span>
              </Button>
            ) : (
              <Button size="sm" onClick={onFreeze}>
                <PauseCircle className="w-3.5 h-3.5" />
                <span>{t.students.actions.freeze}</span>
              </Button>
            )}
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.STUDENTS.DELETE}>
            <Button variant="danger" size="sm" onClick={onDelete}>
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.common.delete}</span>
            </Button>
          </PermissionGuard>
        </div>
      </div>
    </div>
  )
}
