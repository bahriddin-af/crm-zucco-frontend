import { Moon, Sun } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { THEMES, useThemeStore } from '@/stores/themeStore'

/** Kunduzgi / tungi rejim almashtirgichi. */
export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const isDark = theme === THEMES.DARK
  const label = isDark ? t.layout.switchToLight : t.layout.switchToDark

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="w-8 h-8 inline-flex items-center justify-center rounded-md text-caption hover:text-heading hover:bg-divider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
