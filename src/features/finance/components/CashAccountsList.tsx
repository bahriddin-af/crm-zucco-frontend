import { Banknote, Building, CreditCard, Smartphone, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { useCashAccounts } from '../hooks/useFinance'
import { CASH_ACCOUNT_TYPE, type CashAccountType } from '../types/financeTypes'
import { SectionCard } from '@/components/ui/SectionCard'

const ACCOUNT_ICONS: Record<CashAccountType, LucideIcon> = {
  [CASH_ACCOUNT_TYPE.Cash]: Banknote,
  [CASH_ACCOUNT_TYPE.BankAccount]: Building,
  [CASH_ACCOUNT_TYPE.Terminal]: CreditCard,
  [CASH_ACCOUNT_TYPE.OnlineAggregator]: Smartphone,
}

const SKELETON_ROWS = [1, 2, 3]

export function CashAccountsList() {
  const { t } = useTranslation()
  const { data: accounts = [], isLoading, isError, error, refetch } = useCashAccounts()

  return (
    <SectionCard title={t.finance.cashAccountsTitle} subtitle={t.finance.cashAccountsSubtitle}>
      {isLoading ? (
        <div className="space-y-3">
          {SKELETON_ROWS.map((row) => (
            <Skeleton key={row} className="h-14" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : accounts.length === 0 ? (
        <EmptyState title={t.finance.cashAccountsEmpty} />
      ) : (
        <ul className="divide-y divide-divider">
          {accounts.map((account) => {
            const Icon = ACCOUNT_ICONS[account.type]
            return (
              <li key={account.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-heading truncate">{account.name}</span>
                      {account.isDefault && <Badge variant="success">{t.finance.defaultAccount}</Badge>}
                    </div>
                    <span className="text-[11px] text-caption">{t.finance.cashAccountTypes[account.type]}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-heading tabular-nums">
                  {formatCurrency(account.balance)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}
