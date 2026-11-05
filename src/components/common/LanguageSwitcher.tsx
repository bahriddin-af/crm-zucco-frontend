import { Globe } from 'lucide-react'
import { LANGUAGES, type SupportedLanguage } from '@/i18n/types'
import { useTranslation } from '@/i18n'

const isSupportedLanguage = (value: string): value is SupportedLanguage =>
  LANGUAGES.some((lang) => lang.code === value)

export function LanguageSwitcher() {
  const { t, language, setLanguage } = useTranslation()

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-canvas border border-border text-xs font-medium text-secondary-ink">
      <Globe className="w-3.5 h-3.5 text-primary" />
      <select
        value={language}
        onChange={(e) => {
          if (isSupportedLanguage(e.target.value)) setLanguage(e.target.value)
        }}
        className="bg-transparent border-none text-xs font-semibold text-heading focus:outline-none cursor-pointer"
        aria-label={t.layout.selectLanguage}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}
