import { isAxiosError } from 'axios'
import { getTranslations } from '@/i18n'
import type { ErrorMessages } from '@/i18n/messages/errors'
import { HTTP_STATUS } from '@/constants/http'

/** Backend idempotentlik kaliti boshqa payload bilan qayta ishlatilganda qaytaradigan kod. */
export const OPERATION_CONFLICT_CODE = 'operation_key_reused_with_different_payload'

export function getApiErrorStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined
}

export function getApiErrorCode(error: unknown): string | undefined {
  if (!isAxiosError(error)) return undefined
  const data: unknown = error.response?.data
  if (typeof data !== 'object' || data === null || !('code' in data)) return undefined
  const { code } = data as { code?: unknown }
  return typeof code === 'string' ? code : undefined
}

const isKnownCode = (code: string, messages: ErrorMessages): code is keyof ErrorMessages => code in messages

/** Backend xato kodini joriy tildagi tushunarli xabarga aylantiradi. */
export function getApiErrorMessage(error: unknown): string {
  const { errors } = getTranslations()

  if (isAxiosError(error) && !error.response) return errors.network

  const code = getApiErrorCode(error)
  if (code && isKnownCode(code, errors)) return errors[code]

  switch (getApiErrorStatus(error)) {
    case HTTP_STATUS.FORBIDDEN:
      return errors.forbidden
    case HTTP_STATUS.NOT_FOUND:
      return errors.not_found
    case HTTP_STATUS.CONFLICT:
      return errors.conflict
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return errors.rate_limit_exceeded
    default:
      return errors.generic
  }
}

/** Javob umuman kelmagan (tarmoq) xatolar: faqat shularni xavfsiz qayta yuborish mumkin. */
export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response
}
