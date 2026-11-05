import { z } from 'zod'
import type { Translations } from '@/i18n'
import { GUID_PATTERN, PHONE_PATTERN } from '@/utils/formUtils'

/**
 * Backend `LoginRequest(phone, password, tenantId?)`: telefon va parol bo'sh bo'lmasligi shart.
 * `tenantId` faqat backend `tenant_selection_required` qaytargandan keyin (`requireTenant`) majburiy.
 */
export function createLoginSchema(t: Translations) {
  return z
    .object({
      phone: z.string().trim().min(1, t.common.requiredField).regex(PHONE_PATTERN, t.common.invalidPhone),
      password: z.string().min(1, t.common.requiredField),
      requireTenant: z.boolean(),
      tenantId: z.string().trim(),
    })
    .superRefine((values, ctx) => {
      if (!values.requireTenant) return
      if (!values.tenantId) {
        ctx.addIssue({ code: 'custom', path: ['tenantId'], message: t.common.requiredField })
      } else if (!GUID_PATTERN.test(values.tenantId)) {
        ctx.addIssue({ code: 'custom', path: ['tenantId'], message: t.auth.tenantIdInvalid })
      }
    })
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
