import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListState } from '@/components/ui/ListState'
import { SectionCard } from '@/components/ui/SectionCard'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { useCashAccounts } from '../hooks/useFinance'
import type { CashAccount } from '../types/financeTypes'
import { CashAccountModal } from './accounts/CashAccountModal'
import { CashAccountRow } from './accounts/CashAccountRow'

const SKELETON_ROWS = 3

/** `undefined` — modal yopiq, `null` — yangi hisob, obyekt — tahrirlash. */
type EditingAccount = CashAccount | null | undefined

export function CashAccountsList() {
  const { t } = useTranslation()
  const { data: accounts = [], isLoading, isError, error, refetch } = useCashAccounts()
  const [editing, setEditing] = useState<EditingAccount>(undefined)

  return (
    <SectionCard
      title={t.finance.cashAccountsTitle}
      subtitle={t.finance.cashAccountsSubtitle}
      actions={
        <PermissionGuard permission={PERMISSIONS.FINANCE.CASH_ACCOUNT_MANAGE}>
          <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(null)}>
            <Plus className="w-3.5 h-3.5" />
            <span>{t.finance.accountForm.add}</span>
          </Button>
        </PermissionGuard>
      }
    >
      <ListState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={accounts.length === 0}
        empty={<EmptyState title={t.finance.cashAccountsEmpty} />}
        skeletonRows={SKELETON_ROWS}
      >
        <ul className="divide-y divide-divider">
          {accounts.map((account) => (
            <CashAccountRow key={account.id} account={account} onEdit={setEditing} />
          ))}
        </ul>
      </ListState>

      {editing !== undefined && <CashAccountModal account={editing} onClose={() => setEditing(undefined)} />}
    </SectionCard>
  )
}
