import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SupportedLanguage } from '@/i18n/types'

interface LanguageState {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'uz-Cyrl', // Boshlang'ich default til: O'zbek kirillcha
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'zucco-language-storage',
    }
  )
)
