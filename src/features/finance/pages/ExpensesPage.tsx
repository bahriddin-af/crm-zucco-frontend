import { useState } from 'react'
import { ArrowDownRight, Plus, Wallet } from 'lucide-react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { ExpenseModal } from '../components/ExpenseModal'
import { ExpensesJournal } from '../components/expenses/ExpensesJournal'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { useFinanceSummary } from '../hooks/useFinance'

function ExpensesKpiCards() {
  const { t } = useTranslation()
  const { data: summary, isLoading, isError, error, refetch } = useFinanceSummary()

  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard
        label={t.expenses.monthlyExpenses}
        value={formatCurrency(summary?.totalExpensesThisMonth ?? 0)}
        hint={t.expenses.monthlyExpensesHint}
        icon={<ArrowDownRight className="w-4 h-4" />}
        tone="negative"
        isLoading={isLoading}
      />
      <StatCard
        label={t.expenses.availableBalance}
        value={formatCurrency(summary?.totalCashBalance ?? 0)}
        hint={t.expenses.availableBalanceHint}
        icon={<Wallet className="w-4 h-4" />}
        isLoading={isLoading}
      />
    </div>
  )
}

export function ExpensesPage() {
  const { t } = useTranslation()
  const [isExpenseOpen, setIsExpenseOpen] = useState(false)

  const addButton = (
    <PermissionGuard permission={PERMISSIONS.FINANCE.EXPENSE_CREATE}>
      <Button variant="primary" size="sm" onClick={() => setIsExpenseOpen(true)}>
        <Plus className="w-3.5 h-3.5" />
        <span>{t.expenses.add}</span>
      </Button>
    </PermissionGuard>
  )

  return (
    <div className="space-y-5">
      <PageHeader title={t.expenses.title} subtitle={t.expenses.subtitle} actions={addButton} />

      <ErrorBoundary>
        <ExpensesKpiCards />
      </ErrorBoundary>

      <ErrorBoundary>
        <ExpensesJournal emptyAction={addButton} />
      </ErrorBoundary>

      <ExpenseModal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} />
    </div>
  )
}
