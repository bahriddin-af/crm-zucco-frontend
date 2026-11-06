import { Link } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import { useTranslation } from '@/i18n'

/** Foydalanuvchida sahifa uchun ruxsat bo'lmaganda ko'rsatiladi (prototip: 37-access-denied). */
export function AccessDeniedPage() {
  const { t } = useTranslation()

  return (
    <section
      role="alert"
      className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-lg border border-border bg-surface"
    >
      <div className="w-12 h-12 rounded-full bg-debt-soft text-debt-ink flex items-center justify-center mb-4">
        <ShieldOff className="w-6 h-6" aria-hidden="true" />
      </div>
      <h1 className="text-base font-semibold text-heading mb-1">{t.ui.accessDeniedTitle}</h1>
      <p className="text-xs text-caption max-w-md mb-5">{t.ui.accessDeniedDescription}</p>
      <Link
        to={ROUTES.OVERVIEW}
        className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-primary hover:bg-primary-hover text-white"
      >
        {t.ui.accessDeniedBack}
      </Link>
    </section>
  )
}
