import { getTranslations, type SupportedLanguage } from '@/i18n'
import { useLanguageStore } from '@/stores/languageStore'

/**
 * Zucco markaziy formatlash yordamchilari. Barcha pul, tanga, sana va foizlar shu yerdan
 * joriy interfeys tiliga mos formatlanadi; birliklar (so'm, tanga) i18n `common` namespace'idan olinadi.
 */

const INTL_LOCALES: Record<SupportedLanguage, string> = {
  'uz-Cyrl': 'uz-Cyrl-UZ',
  uz: 'uz-Latn-UZ',
  ru: 'ru-RU',
  en: 'en-US',
}

/** Raqamlar guruhlanishi barcha tillarda bir xil ko'rinishi uchun (1 250 000). */
const NUMBER_LOCALE = 'uz-UZ'
const PERCENT_SCALE = 100
const PERCENT_FRACTION_DIGITS = 1

const currentLanguage = (language?: SupportedLanguage): SupportedLanguage =>
  language ?? useLanguageStore.getState().language

export function formatCurrency(amount: number, language?: SupportedLanguage): string {
  const formatted = new Intl.NumberFormat(NUMBER_LOCALE, { maximumFractionDigits: 0 }).format(amount)
  return `${formatted} ${getTranslations(currentLanguage(language)).common.sumUnit}`
}

export function formatCoins(coins: number, language?: SupportedLanguage): string {
  const formatted = new Intl.NumberFormat(NUMBER_LOCALE).format(coins)
  return `${formatted} ${getTranslations(currentLanguage(language)).common.coinsUnit}`
}

/** `12.5` → `12,5%`; `signed` bo'lsa `+12,5%` (o'zgarish ko'rsatkichlari uchun). */
export function formatPercent(value: number, signed = false, language?: SupportedLanguage): string {
  return new Intl.NumberFormat(INTL_LOCALES[currentLanguage(language)], {
    style: 'percent',
    maximumFractionDigits: PERCENT_FRACTION_DIGITS,
    signDisplay: signed ? 'exceptZero' : 'auto',
  }).format(value / PERCENT_SCALE)
}

/** Kasr sonni joriy tilga mos ko'rsatadi (`1.5` → `1,5`; butun son kasrsiz). */
export function formatDecimal(value: number, language?: SupportedLanguage): string {
  return new Intl.NumberFormat(INTL_LOCALES[currentLanguage(language)], {
    maximumFractionDigits: PERCENT_FRACTION_DIGITS,
  }).format(value)
}

export function formatDate(date: string | Date, language?: SupportedLanguage): string {
  const d = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat(INTL_LOCALES[currentLanguage(language)], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatTime(time: string | Date): string {
  const d = typeof time === 'string' ? new Date(time) : time
  return new Intl.DateTimeFormat(NUMBER_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 12 && cleaned.startsWith('998')) {
    return `+998 (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10, 12)}`
  }
  return phone
}
