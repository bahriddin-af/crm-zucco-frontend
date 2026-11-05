/** Backend `Guid` formati. */
export const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Telefon: `+`, raqamlar, bo'shliq, qavs va chiziqcha (kamida 9 raqam). */
export const PHONE_PATTERN = /^\+?[\d\s()-]{9,20}$/

/** Bo'shliq, qavs va chiziqchalarni olib tashlab, `+998...` ko'rinishiga keltiradi. */
export function normalizePhone(phone: string): string {
  const compact = phone.replace(/[\s()-]/g, '')
  return compact.startsWith('+') ? compact : `+${compact}`
}

/** Bo'sh qatorni `null` ga aylantiradi (backend ixtiyoriy maydonlari uchun). */
export function emptyToNull(value: string | undefined | null): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}
