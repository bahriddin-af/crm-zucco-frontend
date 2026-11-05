import { Fragment } from 'react'
import { Check, Minus } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { isPermissionGranted, PERMISSION_GROUPS } from '../types/permissionMatrix'
import type { RoleDto } from '../types/settingsTypes'
import { RoleName } from './RoleName'

interface RolesMatrixProps {
  roles: RoleDto[]
}

/** Faqat o'qish uchun: rollar (ustunlar) × ruxsatnomalar (modul bo'yicha qatorlar). */
export function RolesMatrix({ roles }: RolesMatrixProps) {
  const { t } = useTranslation()

  return (
    <div className="overflow-x-auto bg-surface border border-border rounded-lg shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-canvas border-b border-border text-caption text-2xs font-semibold">
            <th className="py-3 px-4 sticky left-0 bg-canvas">{t.roles.permission}</th>
            {roles.map((role) => (
              <th key={role.id} className="py-3 px-3 text-center whitespace-nowrap" title={role.description ?? undefined}>
                <RoleName name={role.name} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERMISSION_GROUPS.map((group) => (
            <Fragment key={group.module}>
              <tr className="bg-surface-muted border-b border-border">
                <th colSpan={roles.length + 1} className="py-2 px-4 text-2xs font-semibold text-heading sticky left-0">
                  {t.roles.modules[group.module]}
                </th>
              </tr>
              {group.permissions.map((permission) => (
                <tr key={permission} className="border-b border-divider hover:bg-surface-tint">
                  <td className="py-2 px-4 text-copy-strong sticky left-0 bg-surface">{t.roles.permissions[permission]}</td>
                  {roles.map((role) => {
                    const granted = isPermissionGranted(role, permission)
                    const Icon = granted ? Check : Minus
                    return (
                      <td key={role.id} className="py-2 px-3 text-center">
                        <span
                          role="img"
                          aria-label={granted ? t.roles.granted : t.roles.denied}
                          data-permission={permission}
                          data-role={role.name}
                          className={cn('inline-flex', granted ? 'text-success-ink' : 'text-subtle')}
                        >
                          <Icon aria-hidden className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
