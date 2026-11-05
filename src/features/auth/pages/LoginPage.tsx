import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { LoginForm } from '../components/LoginForm'

interface LocationState {
  from?: { pathname?: string }
}

const readRedirectPath = (state: unknown): string => {
  const from = (state as LocationState | null)?.from?.pathname
  return from && from !== ROUTES.AUTH.LOGIN ? from : ROUTES.OVERVIEW
}

export function LoginPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Sessiya mavjud bo'lsa (yoki login hozirgina muvaffaqiyatli bo'lsa) asl sahifaga qaytariladi.
  if (isAuthenticated) {
    return <Navigate to={readRedirectPath(location.state)} replace />
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 gap-4">
      <div className="w-full max-w-[420px] bg-surface border border-border rounded-xl shadow-lg p-7 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
            {t.layout.brandInitial}
          </div>
          <h1 className="text-xl font-bold text-heading tracking-tight">{t.auth.title}</h1>
          <p className="text-xs text-caption">{t.auth.subtitle}</p>
        </div>

        <LoginForm />
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher variant="compact" />
        <ThemeToggle />
      </div>
    </div>
  )
}
