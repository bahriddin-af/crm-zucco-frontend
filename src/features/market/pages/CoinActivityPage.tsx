import { useState } from 'react'
import { Coins, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/forms/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { PageHeader } from '@/components/ui/PageHeader'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { SelectInput } from '@/components/forms/SelectInput'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useCoinTransactions } from '../hooks/useMarket'
import { CoinTransactionsTable } from '../components/CoinTransactionsTable'
import { IssueCoinsModal } from '../components/IssueCoinsModal'
import { COIN_REASON, MARKET_PAGE_SIZE, type CoinReason } from '../types/marketTypes'

const COIN_REASONS = Object.values(COIN_REASON)

export function CoinActivityPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [reason, setReason] = useState<CoinReason | undefined>(undefined)
  const [isIssueOpen, setIsIssueOpen] = useState(false)
  const debouncedSearch = useDebouncedValue(search.trim())
  const { data, isLoading, isError, error, refetch } = useCoinTransactions({
    page,
    pageSize: MARKET_PAGE_SIZE,
    search: debouncedSearch || undefined,
    reason,
  })

  const issueButton = (
    <PermissionGuard permission={PERMISSIONS.GAMIFICATION.COINS_ISSUE}>
      <Button variant="primary" size="sm" onClick={() => setIsIssueOpen(true)}>
        <Plus className="w-3.5 h-3.5" />
        <span>{t.coins.issue}</span>
      </Button>
    </PermissionGuard>
  )

  return (
    <div className="space-y-5">
      <PageHeader title={t.coins.title} subtitle={t.coins.subtitle} actions={issueButton} />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          className="sm:w-full sm:max-w-xs"
          value={search}
          placeholder={t.coins.searchPlaceholder}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
        />
        <SelectInput
          className="sm:max-w-[220px]"
          aria-label={t.coins.reason}
          value={reason ?? ''}
          onChange={(event) => {
            setReason(COIN_REASONS.find((option) => String(option) === event.target.value))
            setPage(1)
          }}
        >
          <option value="">{t.coins.allReasons}</option>
          {COIN_REASONS.map((option) => (
            <option key={option} value={option}>
              {t.coins.reasons[option]}
            </option>
          ))}
        </SelectInput>
      </div>

      <ErrorBoundary>
        <div className="bg-white border border-border rounded-lg shadow-xs p-3">
          {isLoading && <ListSkeleton rows={8} />}
          {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
          {data && data.items.length === 0 && (
            <EmptyState
              icon={<Coins className="w-5 h-5" />}
              title={t.coins.emptyTitle}
              description={t.coins.emptyDescription}
              action={issueButton}
            />
          )}
          {data && data.items.length > 0 && (
            <>
              <CoinTransactionsTable transactions={data.items} />
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </ErrorBoundary>

      {isIssueOpen && <IssueCoinsModal onClose={() => setIsIssueOpen(false)} />}
    </div>
  )
}
