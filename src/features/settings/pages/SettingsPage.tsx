import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useTranslation } from '@/i18n'
import { ProfileCard } from '../components/ProfileCard'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionCard } from '@/components/ui/SectionCard'

/** Shaxsiy sozlamalar: profil, parol va interfeys tili. */
export function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />

      <ErrorBoundary>
        <ProfileCard />
      </ErrorBoundary>

      <ErrorBoundary>
        <ChangePasswordForm />
      </ErrorBoundary>

      <SectionCard title={t.settings.languageTitle}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-2xs text-caption">{t.settings.languageDescription}</p>
          <LanguageSwitcher />
        </div>
      </SectionCard>
    </div>
  )
}
