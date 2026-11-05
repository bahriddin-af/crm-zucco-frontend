import { useState } from 'react'
import { Lock } from 'lucide-react'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { PageHeader } from '@/components/ui/PageHeader'
import { MONTH_PERIOD_PATTERN, toMonthPeriod } from '@/utils/dateUtils'
import { ReportContent } from '../components/ReportContent'

export function ReportsPage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState(() => toMonthPeriod())

  const handlePeriodChange = (value: string) => {
    // Brauzer oy maydonini tozalaganda yoki noto'g'ri qiymatda oldingi davr saqlanadi.
    if (MONTH_PERIOD_PATTERN.test(value)) setPeriod(value)
  }

  const periodPicker = (
    <label className="flex items-center gap-2 text-2xs text-caption">
      <span>{t.reports.period}</span>
      <Input
        type="month"
        value={period}
        max={toMonthPeriod()}
        onChange={(event) => handlePeriodChange(event.target.value)}
        aria-label={t.reports.period}
        className="w-40"
      />
    </label>
  )

  return (
    <PermissionGuard
      permission={PERMISSIONS.FINANCE.VIEW}
      fallback={
        <EmptyState
          icon={<Lock className="w-5 h-5" />}
          title={t.reports.noAccessTitle}
          description={t.reports.noAccessDescription}
        />
      }
    >
      <div className="space-y-6">
        <PageHeader title={t.reports.title} subtitle={t.reports.subtitle} actions={periodPicker} />
        <ReportContent period={period} />
      </div>
    </PermissionGuard>
  )
}
