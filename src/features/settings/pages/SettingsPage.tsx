import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { useTranslation } from '@/i18n'
import { ProfileCard } from '../components/ProfileCard'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionCard } from '@/components/ui/SectionCard'

/**
 * Shaxsiy sozlamalar: profil, parol va interfeys tili.
 * Keng ekranda ikki ustun (chapda profil + til, o'ngda parol), tor ekranda bitta ustun.
 */
export function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <ErrorBoundary>
            <ProfileCard />
          </ErrorBoundary>

          <SectionCard title={t.settings.languageTitle}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-2xs text-caption">{t.settings.languageDescription}</p>
              <LanguageSwitcher />
            </div>
          </SectionCard>
        </div>

        <ErrorBoundary>
          <ChangePasswordForm />
        </ErrorBoundary>
      </div>
    </div>
  )
}
