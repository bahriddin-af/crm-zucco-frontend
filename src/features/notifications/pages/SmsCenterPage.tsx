import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useTranslation } from '@/i18n'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionCard } from '@/components/ui/SectionCard'
import { SmsSendForm } from '../components/SmsSendForm'
import { SmsTemplatesSection } from '../components/SmsTemplatesSection'
import { SmsLogsSection } from '../components/SmsLogsSection'

export function SmsCenterPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader title={t.sms.title} subtitle={t.sms.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <ErrorBoundary>
            <SectionCard title={t.sms.sendTitle}>
              <SmsSendForm />
            </SectionCard>
          </ErrorBoundary>
          <ErrorBoundary>
            <SmsTemplatesSection />
          </ErrorBoundary>
        </div>
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <SmsLogsSection />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
