import { useState } from 'react'
import { MinusCircle, Plus } from 'lucide-react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { Button } from '@/components/ui/Button'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { CashAccountsList } from '../components/CashAccountsList'
import { ExpenseModal } from '../components/ExpenseModal'
import { FinanceKpiCards } from '../components/FinanceKpiCards'
import { PageHeader } from '@/components/ui/PageHeader'
import { PaymentDrawer } from '../components/PaymentDrawer'
import { PaymentsHistory } from '../components/payments/PaymentsHistory'
import { RunBillingButton } from '../components/RunBillingButton'

export function FinanceDeskPage() {
  const { t } = useTranslation()
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isExpenseOpen, setIsExpenseOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.finance.title}
        subtitle={t.finance.subtitle}
        actions={
          <>
            <RunBillingButton />
            <PermissionGuard permission={PERMISSIONS.FINANCE.EXPENSE_CREATE}>
              <Button variant="danger" onClick={() => setIsExpenseOpen(true)}>
                <MinusCircle className="w-4 h-4" />
                <span>{t.finance.recordExpense}</span>
              </Button>
            </PermissionGuard>
            <PermissionGuard permission={PERMISSIONS.FINANCE.PAYMENT_CREATE}>
              <Button variant="primary" onClick={() => setIsPaymentOpen(true)}>
                <Plus className="w-4 h-4" />
                <span>{t.finance.acceptPayment}</span>
              </Button>
            </PermissionGuard>
          </>
        }
      />

      <ErrorBoundary>
        <FinanceKpiCards />
      </ErrorBoundary>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ErrorBoundary>
            <PaymentsHistory />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <CashAccountsList />
        </ErrorBoundary>
      </div>

      <PaymentDrawer isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
      <ExpenseModal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} />
    </div>
  )
}
