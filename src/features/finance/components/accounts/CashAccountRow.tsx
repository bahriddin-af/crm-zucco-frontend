import { Banknote, Building, CreditCard, Edit2, Smartphone, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { CASH_ACCOUNT_TYPE, type CashAccount, type CashAccountType } from '../../types/financeTypes'

const ACCOUNT_ICONS: Record<CashAccountType, LucideIcon> = {
  [CASH_ACCOUNT_TYPE.Cash]: Banknote,
  [CASH_ACCOUNT_TYPE.BankAccount]: Building,
  [CASH_ACCOUNT_TYPE.Terminal]: CreditCard,
  [CASH_ACCOUNT_TYPE.OnlineAggregator]: Smartphone,
}

interface CashAccountRowProps {
  account: CashAccount
  onEdit: (account: CashAccount) => void
}

export function CashAccountRow({ account, onEdit }: CashAccountRowProps) {
  const { t } = useTranslation()
  const Icon = ACCOUNT_ICONS[account.type]

  return (
    <li className="py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-heading truncate">{account.name}</span>
            {account.isDefault && <Badge variant="success">{t.finance.defaultAccount}</Badge>}
          </div>
          <span className="text-2xs text-caption">{t.finance.cashAccountTypes[account.type]}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-sm font-bold text-heading tabular-nums">{formatCurrency(account.balance)}</span>
        <PermissionGuard permission={PERMISSIONS.FINANCE.CASH_ACCOUNT_MANAGE}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t.finance.accountForm.edit}
            title={t.finance.accountForm.edit}
            onClick={() => onEdit(account)}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
        </PermissionGuard>
      </div>
    </li>
  )
}
