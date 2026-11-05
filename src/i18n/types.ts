export type SupportedLanguage = 'uz-Cyrl' | 'uz' | 'ru' | 'en'

export interface LanguageOption {
  code: SupportedLanguage
  label: string
  shortLabel: string
  flag: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'uz-Cyrl', label: 'Ўзбекча (Кирилл)', shortLabel: 'ЎЗБ', flag: '🇺🇿' },
  { code: 'uz', label: "O'zbekcha (Lotin)", shortLabel: 'OʻZB', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', shortLabel: 'РУС', flag: '🇷🇺' },
  { code: 'en', label: 'English', shortLabel: 'ENG', flag: '🇺🇸' },
]
