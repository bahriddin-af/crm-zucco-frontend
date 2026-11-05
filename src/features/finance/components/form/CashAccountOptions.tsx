import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import type { CashAccount } from '../../types/financeTypes'

interface CashAccountOptionsProps {
  accounts: CashAccount[]
  placeholder: string
}

/** Kassa hisoblari `<option>` ro'yxati (nomi va joriy balansi bilan). */
export function CashAccountOptions({ accounts, placeholder }: CashAccountOptionsProps) {
  const { t } = useTranslation()

  return (
    <>
      <option value="">{placeholder}</option>
      {accounts.map((account) => (
        <option key={account.id} value={account.id}>
          {interpolate(t.finance.accountOption, {
            name: account.name,
            balance: formatCurrency(account.balance),
          })}
        </option>
      ))}
    </>
  )
}
