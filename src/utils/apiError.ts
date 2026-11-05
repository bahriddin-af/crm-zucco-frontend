import { isAxiosError } from 'axios'
import { getTranslations } from '@/i18n'
import type { ErrorMessages } from '@/i18n/messages/errors'
import { HTTP_STATUS, SERVER_UNREACHABLE_STATUSES } from '@/constants/http'

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

  if (isNetworkError(error)) return errors.network

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

/**
 * Server bilan aloqa yo'q: javob umuman kelmagan yoki proxy/gateway backendga yetolmagan (502/503/504).
 * Bunday so'rov backendda bajarilmagan, shuning uchun (bir xil operationId bilan) qayta yuborish xavfsiz.
 */
export function isNetworkError(error: unknown): boolean {
  if (!isAxiosError(error)) return false
  const status = error.response?.status
  return status === undefined || SERVER_UNREACHABLE_STATUSES.includes(status)
}
