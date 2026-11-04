import { useLanguageStore } from '@/stores/languageStore'
import { uzCyrlTranslations } from './locales/uzCyrl'
import { uzLatnTranslations } from './locales/uzLatn'
import { ruTranslations } from './locales/ru'
import { enTranslations } from './locales/en'
import type { SupportedLanguage, Translations } from './types'

const TRANSLATION_MAP: Record<SupportedLanguage, Translations> = {
  'uz-Cyrl': uzCyrlTranslations,
  uz: uzLatnTranslations,
  ru: ruTranslations,
  en: enTranslations,
}

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  const t = TRANSLATION_MAP[language] || uzCyrlTranslations

  return {
    t,
    language,
    setLanguage,
  }
}

export * from './types'
