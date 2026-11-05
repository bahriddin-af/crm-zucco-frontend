import { z } from 'zod'
import { interpolate, type Translations } from '@/i18n'
import { PHONE_PATTERN } from '@/utils/formUtils'
import { MIN_PASSWORD_LENGTH, STAFF_ROLE_TYPE_VALUES, USER_STATUS_VALUES } from '../types/staffTypes'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isOneOf = (values: readonly number[]) => (value: number): boolean => values.includes(value)

/**
 * Backend `CreateOrUpdateStaffRequest` + `StaffService.UpsertAsync`:
 * yangi xodim uchun parol majburiy (`password_required_for_new_staff`), berilgan parol `PasswordPolicy` (≥ 12).
 */
export function createStaffSchema(t: Translations, isEditing: boolean) {
  const passwordMessage = interpolate(t.staff.passwordMin, { min: MIN_PASSWORD_LENGTH })

  return z.object({
    fullName: z.string().trim().min(1, t.common.requiredField),
    phone: z.string().trim().min(1, t.common.requiredField).regex(PHONE_PATTERN, t.common.invalidPhone),
    email: z
      .string()
      .trim()
      .refine((value) => value === '' || EMAIL_PATTERN.test(value), t.common.invalidEmail),
    password: z
      .string()
      .refine((value) => (isEditing && value === '') || value.length >= MIN_PASSWORD_LENGTH, passwordMessage),
    roleType: z.number().refine(isOneOf(STAFF_ROLE_TYPE_VALUES), t.common.requiredField),
    status: z.number().refine(isOneOf(USER_STATUS_VALUES), t.common.requiredField),
    specialization: z.string().trim(),
    hireDate: z.string().min(1, t.common.requiredField),
    roleIds: z.array(z.string()),
  })
}

export type StaffFormValues = z.infer<ReturnType<typeof createStaffSchema>>
