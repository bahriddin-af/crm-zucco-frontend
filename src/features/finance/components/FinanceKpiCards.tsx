import { AlertCircle, MinusCircle, Receipt, Wallet } from 'lucide-react'
import { ErrorState } from '@/components/ui/ErrorState'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { useFinanceSummary } from '../hooks/useFinance'
import { StatCard } from '@/components/ui/StatCard'

export function FinanceKpiCards() {
  const { t } = useTranslation()
  const { data: summary, isLoading, isError, error, refetch } = useFinanceSummary()
  const kpi = t.finance.kpi

  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label={kpi.totalBalance}
        value={formatCurrency(summary?.totalCashBalance ?? 0)}
        hint={kpi.totalBalanceHint}
        icon={<Wallet className="w-4 h-4" />}
        isLoading={isLoading}
      />
      <StatCard
        label={kpi.monthlyRevenue}
        value={formatCurrency(summary?.totalPaymentsThisMonth ?? 0)}
        hint={kpi.monthlyRevenueHint}
        icon={<Receipt className="w-4 h-4" />}
        tone="positive"
        isLoading={isLoading}
      />
      <StatCard
        label={kpi.monthlyExpenses}
        value={formatCurrency(summary?.totalExpensesThisMonth ?? 0)}
        hint={kpi.monthlyExpensesHint}
        icon={<MinusCircle className="w-4 h-4" />}
        tone="negative"
        isLoading={isLoading}
      />
      <StatCard
        label={kpi.totalDebt}
        value={formatCurrency(summary?.totalStudentDebt ?? 0)}
        hint={interpolate(kpi.debtorsHint, { count: summary?.totalDebtorsCount ?? 0 })}
        icon={<AlertCircle className="w-4 h-4" />}
        tone="warning"
        isLoading={isLoading}
      />
    </div>
  )
}
