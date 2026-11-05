import { useController, type Control } from 'react-hook-form'
import { useTranslation } from '@/i18n'
import type { StaffFormValues } from '../schemas/staffSchema'
import type { StaffRoleDto } from '../types/staffTypes'

interface StaffRolesFieldProps {
  control: Control<StaffFormValues>
  roles: StaffRoleDto[]
}

/** Tizim rollari (`GET /api/staff/roles`) — faqat `staff.roles_manage` ruxsati bilan ko'rsatiladi. */
export function StaffRolesField({ control, roles }: StaffRolesFieldProps) {
  const { t } = useTranslation()
  const { field } = useController({ control, name: 'roleIds' })

  const toggle = (roleId: string, checked: boolean) =>
    field.onChange(checked ? [...field.value, roleId] : field.value.filter((id) => id !== roleId))

  return (
    <fieldset className="space-y-1.5">
      <legend className="text-xs font-medium text-heading mb-1">{t.staff.form.systemRoles}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {roles.map((role) => (
          <label
            key={role.id}
            className="flex items-start gap-2 p-2 rounded-md border border-border bg-canvas text-xs cursor-pointer hover:border-primary-line"
          >
            <input
              type="checkbox"
              className="mt-0.5 accent-primary"
              checked={field.value.includes(role.id)}
              onChange={(e) => toggle(role.id, e.target.checked)}
            />
            <span>
              <span className="block font-medium text-heading">{role.name}</span>
              {role.description && <span className="block text-3xs text-caption">{role.description}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
