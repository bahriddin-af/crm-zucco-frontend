import { useLanguageStore } from '@/stores/languageStore'
import { TRANSLATIONS } from './messages'
import type { SupportedLanguage } from './types'

export function getTranslations(language: SupportedLanguage = useLanguageStore.getState().language) {
  return TRANSLATIONS[language]
}

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  return {
    t: TRANSLATIONS[language],
    language,
    setLanguage,
  }
}

/** `'Sahifa {page} / {total}'` kabi shablonlarga qiymat qo'yadi. */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}

export type { Translations } from './messages'
export * from './types'
