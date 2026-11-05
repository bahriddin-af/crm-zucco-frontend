import { Edit2, Shield, Trash2 } from 'lucide-react'
import { Badge, type BadgeProps } from '@/components/ui/Badge'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { formatPhone } from '@/utils/formatters'
import { USER_STATUS, type StaffListItem, type UserStatus } from '../types/staffTypes'

const STATUS_VARIANTS: Record<UserStatus, BadgeProps['variant']> = {
  [USER_STATUS.Active]: 'success',
  [USER_STATUS.Inactive]: 'default',
  [USER_STATUS.Suspended]: 'danger',
}

interface StaffTableProps {
  staff: StaffListItem[]
  onEdit: (staff: StaffListItem) => void
  onDelete: (staff: StaffListItem) => void
}

export function StaffTable({ staff, onEdit, onDelete }: StaffTableProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-surface border border-border rounded-xl shadow-xs overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-canvas border-b border-border text-caption text-2xs font-semibold">
            <th className="py-3 px-4">{t.staff.table.fullName}</th>
            <th className="py-3 px-4">{t.staff.table.phone}</th>
            <th className="py-3 px-4">{t.staff.table.roleType}</th>
            <th className="py-3 px-4">{t.staff.table.specialization}</th>
            <th className="py-3 px-4">{t.staff.table.branch}</th>
            <th className="py-3 px-4">{t.staff.table.status}</th>
            <th className="py-3 px-4 text-right">{t.staff.table.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-divider">
          {staff.map((member) => (
            <tr key={member.id} className="hover:bg-surface-tint transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-semibold text-heading">{member.fullName}</div>
                <div className="text-2xs text-subtle flex items-center gap-1 mt-0.5">
                  <Shield className="w-3 h-3" />
                  {member.roles.join(', ') || t.staff.noSystemRoles}
                </div>
              </td>
              <td className="py-3.5 px-4 tabular-nums text-copy-strong">{formatPhone(member.phone)}</td>
              <td className="py-3.5 px-4">
                <Badge variant="accent">{t.staff.roleTypes[member.roleType]}</Badge>
              </td>
              <td className="py-3.5 px-4 text-copy">{member.specialization || '—'}</td>
              <td className="py-3.5 px-4 text-caption">{member.branchName || '—'}</td>
              <td className="py-3.5 px-4">
                <Badge variant={STATUS_VARIANTS[member.status] ?? 'default'}>{t.staff.userStatuses[member.status]}</Badge>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center justify-end gap-1">
                  <PermissionGuard permission={PERMISSIONS.STAFF.UPDATE}>
                    <button
                      type="button"
                      onClick={() => onEdit(member)}
                      title={t.common.edit}
                      aria-label={t.common.edit}
                      className="p-1.5 text-copy hover:text-primary hover:bg-primary-soft rounded-md transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </PermissionGuard>
                  <PermissionGuard permission={PERMISSIONS.STAFF.DELETE}>
                    <button
                      type="button"
                      onClick={() => onDelete(member)}
                      title={t.common.delete}
                      aria-label={t.common.delete}
                      className="p-1.5 text-copy hover:text-debt-ink hover:bg-debt-soft rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </PermissionGuard>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
