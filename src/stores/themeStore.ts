import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

export type Theme = (typeof THEMES)[keyof typeof THEMES]

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

/** Birinchi kirishda operatsion tizim sozlamasiga moslashadi. */
const systemTheme = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia?.(DARK_SCHEME_QUERY).matches ? THEMES.DARK : THEMES.LIGHT

/** `index.css` dagi `:root[data-theme='dark']` token qiymatlarini yoqadi/o'chiradi. */
export const applyTheme = (theme: Theme): void => {
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = theme
}

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

/** Sof mijoz holati (RULES §1.3): tanlangan mavzu localStorage'da saqlanadi. */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: systemTheme(),
      toggleTheme: () => set({ theme: get().theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK }),
    }),
    { name: 'zucco-theme-storage' }
  )
)

// Saqlangan mavzu sahifa chizilishidan oldin qo'llanadi (yorug' ekran "miltillamasligi" uchun).
applyTheme(useThemeStore.getState().theme)
useThemeStore.subscribe((state) => applyTheme(state.theme))
