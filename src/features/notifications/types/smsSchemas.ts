import { z } from 'zod'
import type { Translations } from '@/i18n'
import { SMS_TRIGGER } from './smsTypes'

/** Telefon ichidagi bo'shliq, chiziqcha va qavslar olib tashlanadi. */
const PHONE_SEPARATORS = /[\s()-]/g
/** Backend `SendSmsAsync`: ixtiyoriy `+`, so'ng `998` bilan boshlanuvchi 12 ta raqam. */
const UZ_PHONE_PATTERN = /^\+?998\d{9}$/

export const createSendSmsSchema = (t: Translations) =>
  z.object({
    recipientPhone: z
      .string()
      .transform((value) => value.replace(PHONE_SEPARATORS, ''))
      .pipe(z.string().regex(UZ_PHONE_PATTERN, t.sms.validation.phoneInvalid)),
    message: z.string().trim().min(1, t.sms.validation.messageRequired),
    trigger: z.enum(SMS_TRIGGER, { error: t.sms.validation.triggerRequired }),
  })

export type SendSmsFormInput = z.input<ReturnType<typeof createSendSmsSchema>>
export type SendSmsFormValues = z.output<ReturnType<typeof createSendSmsSchema>>

/** Backend `SmsTemplate.Create/Update`: Guard.Text(title), Guard.Defined(trigger), Guard.Text(templateText). */
export const createSmsTemplateSchema = (t: Translations) =>
  z.object({
    title: z.string().trim().min(1, t.sms.validation.titleRequired),
    trigger: z.enum(SMS_TRIGGER, { error: t.sms.validation.triggerRequired }),
    templateText: z.string().trim().min(1, t.sms.validation.textRequired),
    isActive: z.boolean(),
  })

export type SmsTemplateFormValues = z.infer<ReturnType<typeof createSmsTemplateSchema>>
