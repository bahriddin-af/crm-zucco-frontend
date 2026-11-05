/** Backend `Zucco.Domain.Notifications.Enums.SmsTrigger`. */
export const SMS_TRIGGER = {
  WelcomeNewStudent: 1,
  PaymentReceipt: 2,
  DebtReminder: 3,
  MissedLessonAlert: 4,
  BirthdayGreeting: 5,
  CustomBroadcast: 6,
} as const

export type SmsTrigger = (typeof SMS_TRIGGER)[keyof typeof SMS_TRIGGER]

/**
 * Backend `SmsDeliveryStatus`. Muvaffaqiyatli yuborishda backend `Pending` qaytaradi:
 * provayder xabarni qabul qilgan, yetkazilish holati hali ma'lum emas.
 * `Failed` — provayder rad etdi; `Unknown` — provayder javobi olinmadi (qayta yuborishdan oldin tekshirish kerak).
 */
export const SMS_DELIVERY_STATUS = {
  Pending: 1,
  Sent: 2,
  Delivered: 3,
  Failed: 4,
  Unknown: 5,
} as const

export type SmsDeliveryStatus = (typeof SMS_DELIVERY_STATUS)[keyof typeof SMS_DELIVERY_STATUS]

/** Backend xato kodlari (`Zucco.Infrastructure.Notifications.Exceptions`). */
export const SMS_ERROR_CODE = {
  ProviderRejected: 'sms_provider_rejected',
  SubmissionUnknown: 'sms_submission_unknown',
} as const

export const SMS_LOGS_PAGE_SIZE = 20

export interface SmsTemplate {
  id: string
  title: string
  trigger: SmsTrigger
  templateText: string
  isActive: boolean
}

export interface UpsertSmsTemplateRequest {
  id: string | null
  title: string
  trigger: SmsTrigger
  templateText: string
  isActive: boolean
}

export interface SendSmsRequest {
  recipientPhone: string
  message: string
  trigger: SmsTrigger
  operationId: string
}

export interface SmsLog {
  id: string
  recipientPhone: string
  message: string
  trigger: SmsTrigger
  status: SmsDeliveryStatus
  sentAt: string
}

export interface SmsLogsFilter {
  page: number
  pageSize: number
  search?: string
  status?: SmsDeliveryStatus
}
