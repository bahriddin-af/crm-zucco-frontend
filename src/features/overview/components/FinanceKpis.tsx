import { AlertCircle, TrendingUp, Wallet } from 'lucide-react'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { useFinanceSummary } from '@/features/finance/hooks/useFinance'
import { KpiCard } from './KpiCard'

/** Moliyaviy ko'rsatkichlar bitta `GET /api/finance/summary` so'rovidan olinadi. */
export function FinanceKpis() {
  const { t } = useTranslation()
  const { data: summary, isLoading, error, refetch } = useFinanceSummary()
  const shared = { isLoading, error, onRetry: () => void refetch() }

  return (
    <>
      <KpiCard
        {...shared}
        label={t.overview.monthlyRevenue}
        icon={TrendingUp}
        tone="success"
        value={formatCurrency(summary?.totalPaymentsThisMonth ?? 0)}
        hint={t.overview.monthlyRevenueHint}
      />
      <KpiCard
        {...shared}
        label={t.overview.cashBalance}
        icon={Wallet}
        value={formatCurrency(summary?.totalCashBalance ?? 0)}
        hint={interpolate(t.overview.cashAccountsCount, { count: summary?.cashAccounts.length ?? 0 })}
      />
      <KpiCard
        {...shared}
        label={t.overview.debt}
        icon={AlertCircle}
        tone="debt"
        value={formatCurrency(summary?.totalStudentDebt ?? 0)}
        hint={interpolate(t.overview.debtorsCount, { count: summary?.totalDebtorsCount ?? 0 })}
      />
    </>
  )
}
