import { useCallback, useRef, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { LANGUAGES } from '@/i18n/types'
import { useTranslation } from '@/i18n'
import { useDismiss } from '@/hooks/useDismiss'
import { cn } from '@/utils/cn'

/**
 * Ixcham til tanlagich ("Til: ЎЗБ ⇕"). Native `<select>` o'rniga o'z ro'yxatimiz:
 * ochilgan menyu ham mavzu token'larida chiziladi, shuning uchun tungi rejimda ham o'qiladi.
 */
export function LanguageMenu() {
  const { t, language, setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setIsOpen(false), [])
  useDismiss(containerRef, isOpen, close)

  const current = LANGUAGES.find((lang) => lang.code === language) ?? LANGUAGES[0]

  return (
    <div ref={containerRef} className="relative inline-flex items-center gap-1.5 text-xs">
      <span className="text-caption">{t.layout.languageLabel}:</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t.layout.selectLanguage}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-0.5 font-semibold text-heading rounded px-1 py-0.5 hover:bg-divider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        {current.shortLabel}
        <ChevronsUpDown className="w-3 h-3 text-caption" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t.layout.selectLanguage}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50 min-w-20 py-1 rounded-lg border border-border bg-surface shadow-lg"
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language
            return (
              <li key={lang.code} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code)
                    close()
                  }}
                  title={lang.label}
                  className={cn(
                    'w-full flex items-center justify-between gap-2 px-3 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-primary-soft',
                    isSelected ? 'text-primary' : 'text-heading'
                  )}
                >
                  <span>{lang.shortLabel}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
