import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { interpolate, useTranslation } from '@/i18n'
import { useAuthStore } from '@/stores/authStore'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { emptyToNull, normalizePhone } from '@/utils/formUtils'
import { todayIsoDate } from '@/utils/dateUtils'
import { createStaffSchema, type StaffFormValues } from '../schemas/staffSchema'
import {
  MIN_PASSWORD_LENGTH,
  STAFF_ROLE_TYPE,
  STAFF_ROLE_TYPE_VALUES,
  USER_STATUS,
  USER_STATUS_VALUES,
  type CreateOrUpdateStaffRequest,
  type StaffDetail,
  type StaffRoleDto,
} from '../types/staffTypes'
import { StaffRolesField } from './StaffRolesField'

interface StaffFormProps {
  formId: string
  staff?: StaffDetail
  /** `null` — foydalanuvchida `staff.roles_manage` yo'q, rollar yuborilmaydi. */
  roles: StaffRoleDto[] | null
  onSubmit: (payload: CreateOrUpdateStaffRequest) => void
}

export function StaffForm({ formId, staff, roles, onSubmit }: StaffFormProps) {
  const { t } = useTranslation()
  const activeBranchId = useAuthStore((state) => state.activeBranchId)
  const schema = useMemo(() => createStaffSchema(t, Boolean(staff)), [t, staff])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: staff?.fullName ?? '',
      phone: staff?.phone ?? '',
      email: staff?.email ?? '',
      password: '',
      roleType: staff?.roleType ?? STAFF_ROLE_TYPE.Teacher,
      status: staff?.status ?? USER_STATUS.Active,
      specialization: staff?.specialization ?? '',
      hireDate: staff?.hireDate ?? todayIsoDate(),
      roleIds: (roles ?? []).filter((role) => staff?.roles.includes(role.name)).map((role) => role.id),
    },
  })

  const submit = (values: StaffFormValues) => {
    const roleType = STAFF_ROLE_TYPE_VALUES.find((value) => value === values.roleType) ?? STAFF_ROLE_TYPE.Teacher
    const status = USER_STATUS_VALUES.find((value) => value === values.status) ?? USER_STATUS.Active
    onSubmit({
      id: staff?.id ?? null,
      fullName: values.fullName,
      phone: normalizePhone(values.phone),
      email: emptyToNull(values.email),
      password: values.password || null,
      primaryBranchId: staff ? (staff.primaryBranchId ?? null) : activeBranchId || null,
      roleType,
      status,
      specialization: emptyToNull(values.specialization),
      hireDate: values.hireDate,
      bio: staff?.bio ?? null,
      telegramUsername: staff?.telegramUsername ?? null,
      roleIds: roles ? values.roleIds : null,
    })
  }

  return (
    <form id={formId} onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <FormField label={t.staff.form.fullName} htmlFor="staff-full-name" required>
        <Input id="staff-full-name" placeholder={t.staff.form.fullNamePlaceholder} error={errors.fullName?.message} {...register('fullName')} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label={t.staff.form.phone} htmlFor="staff-phone" required>
          <Input id="staff-phone" type="tel" error={errors.phone?.message} {...register('phone')} />
        </FormField>
        <FormField label={t.staff.form.email} htmlFor="staff-email">
          <Input id="staff-email" type="email" error={errors.email?.message} {...register('email')} />
        </FormField>
        <FormField label={t.staff.form.roleType} htmlFor="staff-role-type" required error={errors.roleType?.message}>
          <SelectInput id="staff-role-type" {...register('roleType', { valueAsNumber: true })}>
            {STAFF_ROLE_TYPE_VALUES.map((value) => (
              <option key={value} value={value}>
                {t.staff.roleTypes[value]}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <FormField label={t.staff.form.status} htmlFor="staff-status" error={errors.status?.message}>
          <SelectInput id="staff-status" {...register('status', { valueAsNumber: true })}>
            {USER_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {t.staff.userStatuses[value]}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <FormField label={t.staff.form.specialization} htmlFor="staff-specialization">
          <Input id="staff-specialization" placeholder={t.staff.form.specializationPlaceholder} {...register('specialization')} />
        </FormField>
        <FormField label={t.staff.form.hireDate} htmlFor="staff-hire-date" required>
          <Input id="staff-hire-date" type="date" error={errors.hireDate?.message} {...register('hireDate')} />
        </FormField>
      </div>

      <FormField label={t.staff.form.password} htmlFor="staff-password" required={!staff}>
        <Input
          id="staff-password"
          type="password"
          autoComplete="new-password"
          placeholder={staff ? t.staff.form.passwordEditHint : interpolate(t.staff.form.passwordPlaceholder, { min: MIN_PASSWORD_LENGTH })}
          error={errors.password?.message}
          {...register('password')}
        />
      </FormField>

      {roles && roles.length > 0 && <StaffRolesField control={control} roles={roles} />}
    </form>
  )
}
