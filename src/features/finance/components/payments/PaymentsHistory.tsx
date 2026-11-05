import { useState } from 'react'
import { Receipt } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { useTranslation } from '@/i18n'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { SearchInput } from '@/components/forms/SearchInput'
import { usePayments } from '../../hooks/useFinance'
import { FINANCE_PAGE_SIZE } from '../../types/financeTypes'
import { SectionCard } from '@/components/ui/SectionCard'
import { ListState } from '@/components/ui/ListState'
import { PaymentsTable } from './PaymentsTable'

/** To'lovlar tarixi: backend qidiruvi (talaba ismi / chek raqami) va sahifalash. */
export function PaymentsHistory() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim())

  const { data, isLoading, isError, error, refetch } = usePayments({
    page,
    pageSize: FINANCE_PAGE_SIZE,
    search: debouncedSearch || undefined,
  })
  const payments = data?.items ?? []

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <SectionCard
      title={t.finance.paymentsTitle}
      subtitle={t.finance.paymentsSubtitle}
      actions={
        <SearchInput value={search} onChange={handleSearch} placeholder={t.finance.paymentsSearch} />
      }
    >
      <ListState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={payments.length === 0}
        empty={
          <EmptyState
            icon={<Receipt className="w-5 h-5" />}
            title={t.finance.paymentsEmptyTitle}
            description={t.finance.paymentsEmptyDescription}
          />
        }
      >
        <PaymentsTable payments={payments} />
        <Pagination page={data?.page ?? page} totalPages={data?.totalPages ?? 0} onPageChange={setPage} />
      </ListState>
    </SectionCard>
  )
}
