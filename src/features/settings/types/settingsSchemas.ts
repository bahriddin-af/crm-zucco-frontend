import { z } from 'zod'
import { interpolate, type Translations } from '@/i18n'
import { PASSWORD_MIN_LENGTH } from './settingsTypes'

/** Backend `PasswordPolicy.Validate`: bo'sh emas va kamida 12 belgi. */
export const createChangePasswordSchema = (t: Translations) =>
  z
    .object({
      currentPassword: z.string().min(1, t.settings.validation.currentRequired),
      newPassword: z
        .string()
        .refine((value) => value.trim().length > 0, t.settings.validation.newRequired)
        .refine(
          (value) => value.length >= PASSWORD_MIN_LENGTH,
          interpolate(t.settings.validation.newMin, { min: PASSWORD_MIN_LENGTH })
        ),
      confirmPassword: z.string(),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: t.settings.validation.mismatch,
      path: ['confirmPassword'],
    })

export type ChangePasswordFormValues = z.infer<ReturnType<typeof createChangePasswordSchema>>
