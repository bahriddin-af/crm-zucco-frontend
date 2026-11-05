import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from '@/i18n'
import { useMonthlyReport } from '../hooks/useReports'
import { BreakdownList } from './BreakdownList'
import { ReportsKpiGrid } from './ReportsKpiGrid'
import { TrendChart } from './TrendChart'

const KPI_SKELETONS = [1, 2, 3, 4, 5, 6]

function ReportSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KPI_SKELETONS.map((item) => (
          <Skeleton key={item} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  )
}

/** Tanlangan oy hisobotining barcha bloklari (KPI, taqsimotlar, dinamika). */
export function ReportContent({ period }: { period: string }) {
  const { t } = useTranslation()
  const { data: report, isLoading, isError, error, refetch } = useMonthlyReport(period)

  if (isLoading) return <ReportSkeleton />
  if (isError || !report) return <ErrorState error={error} onRetry={() => void refetch()} />

  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <ReportsKpiGrid report={report} />
      </ErrorBoundary>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <BreakdownList
            title={t.reports.byMethod}
            tone="positive"
            items={report.revenueByMethod.map((item) => ({
              key: String(item.method),
              label: t.finance.paymentMethods[item.method],
              amount: item.amount,
            }))}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <BreakdownList
            title={t.reports.byCategory}
            tone="negative"
            items={report.expensesByCategory.map((item) => ({
              key: item.categoryId,
              label: item.categoryName,
              amount: item.amount,
            }))}
          />
        </ErrorBoundary>
      </div>

      <ErrorBoundary>
        <TrendChart points={report.trend} />
      </ErrorBoundary>
    </div>
  )
}
