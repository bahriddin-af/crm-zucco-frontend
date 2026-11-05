import { useState } from 'react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useTranslation } from '@/i18n'
import { PageHeader } from '@/components/ui/PageHeader'
import { toMonthPeriod } from '@/utils/dateUtils'
import { PayrollFiltersBar } from '../components/payroll/PayrollFiltersBar'
import { SalaryCalculationsSection } from '../components/payroll/SalaryCalculationsSection'
import { SalarySchemesSection } from '../components/payroll/SalarySchemesSection'

export function PayrollPage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState(() => toMonthPeriod())
  const [teacherId, setTeacherId] = useState('')

  return (
    <div className="space-y-5">
      <PageHeader title={t.payroll.title} subtitle={t.payroll.subtitle} />

      <PayrollFiltersBar
        period={period}
        teacherId={teacherId}
        onPeriodChange={setPeriod}
        onTeacherChange={setTeacherId}
      />

      <ErrorBoundary>
        <SalaryCalculationsSection period={period} teacherId={teacherId} />
      </ErrorBoundary>

      <ErrorBoundary>
        <SalarySchemesSection teacherId={teacherId} />
      </ErrorBoundary>
    </div>
  )
}
