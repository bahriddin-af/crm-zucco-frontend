import { Globe } from 'lucide-react'
import { LANGUAGES, type SupportedLanguage } from '@/i18n/types'
import { useTranslation } from '@/i18n'

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#F6F8F7] border border-[#E3EAE5] text-xs font-medium text-[#344B3E]">
        <Globe className="w-3.5 h-3.5 text-[#146B52]" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          className="bg-transparent border-none text-xs font-semibold text-[#1E2B24] focus:outline-none cursor-pointer"
          aria-label="Тилни танлаш / Select language"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
