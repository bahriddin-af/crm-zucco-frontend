import { useLanguageStore } from '@/stores/languageStore'

/**
 * Zucco markaziy formatlash yordamchilari (Ko'p tillilikka to'liq moslangan)
 */

export function formatCurrency(amount: number, customLang?: string): string {
  const lang = customLang || useLanguageStore.getState().language

  const formatted = new Intl.NumberFormat('uz-UZ', {
    maximumFractionDigits: 0,
  }).format(amount)

  if (lang === 'en') return `${formatted} UZS`
  if (lang === 'ru') return `${formatted} сум`
  if (lang === 'uz') return `${formatted} so'm`
  return `${formatted} сўм`
}

export function formatCoins(coins: number, customLang?: string): string {
  const lang = customLang || useLanguageStore.getState().language
  const formatted = new Intl.NumberFormat('uz-UZ').format(coins)

  if (lang === 'en') return `${formatted} coins`
  if (lang === 'ru') return `${formatted} монет`
  if (lang === 'uz') return `${formatted} tanga`
  return `${formatted} танга`
}

export function formatDate(date: string | Date, customLang?: string): string {
  const lang = customLang || useLanguageStore.getState().language
  const d = typeof date === 'string' ? new Date(date) : date

  const locale = lang === 'en' ? 'en-US' : lang === 'ru' ? 'ru-RU' : 'uz-UZ'

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatTime(time: string | Date): string {
  const d = typeof time === 'string' ? new Date(time) : time
  return new Intl.DateTimeFormat('uz-UZ', {
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
