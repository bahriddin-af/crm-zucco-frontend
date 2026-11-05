import { ChevronsUpDown, Globe } from 'lucide-react'
import { LANGUAGES, type SupportedLanguage } from '@/i18n/types'
import { useTranslation } from '@/i18n'

const isSupportedLanguage = (value: string): value is SupportedLanguage =>
  LANGUAGES.some((lang) => lang.code === value)

interface LanguageSwitcherProps {
  /** `compact` — "Til: ЎЗБ" ko'rinishidagi ixcham variant (login sahifasi pastida). */
  variant?: 'default' | 'compact'
}

export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { t, language, setLanguage } = useTranslation()
  const isCompact = variant === 'compact'

  const select = (
    <select
      value={language}
      onChange={(e) => {
        if (isSupportedLanguage(e.target.value)) setLanguage(e.target.value)
      }}
      className={
        isCompact
          ? 'appearance-none bg-transparent border-none pr-4 text-xs font-semibold text-heading focus:outline-none cursor-pointer'
          : 'bg-transparent border-none text-xs font-semibold text-heading focus:outline-none cursor-pointer'
      }
      aria-label={t.layout.selectLanguage}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {isCompact ? lang.shortLabel : `${lang.flag} ${lang.label}`}
        </option>
      ))}
    </select>
  )

  if (isCompact) {
    return (
      <label className="flex items-center gap-1.5 text-xs text-caption">
        <span>{t.layout.languageLabel}:</span>
        <span className="relative inline-flex items-center">
          {select}
          <ChevronsUpDown className="w-3 h-3 text-caption absolute right-0 pointer-events-none" />
        </span>
      </label>
    )
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-canvas border border-border text-xs font-medium text-secondary-ink">
      <Globe className="w-3.5 h-3.5 text-primary" />
      {select}
    </div>
  )
}
