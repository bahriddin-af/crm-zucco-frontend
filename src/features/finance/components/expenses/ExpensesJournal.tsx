import { useState, type ReactNode } from 'react'
import { MinusCircle } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { useTranslation } from '@/i18n'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { SearchInput } from '@/components/forms/SearchInput'
import { SelectInput } from '@/components/forms/SelectInput'
import { useExpenseCategories, useExpenses } from '../../hooks/useFinance'
import { FINANCE_PAGE_SIZE } from '../../types/financeTypes'
import { SectionCard } from '@/components/ui/SectionCard'
import { ListState } from '@/components/ui/ListState'
import { ExpensesTable } from './ExpensesTable'

interface ExpensesJournalProps {
  /** Bo'sh holatdagi "qo'shish" tugmasi (ruxsat bilan o'ralgan). */
  emptyAction?: ReactNode
}

/** Xarajatlar jurnali: toifa filtri, qidiruv va backend sahifalash. */
export function ExpensesJournal({ emptyAction }: ExpensesJournalProps) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim())
  const { data: categories = [] } = useExpenseCategories()

  const { data, isLoading, isError, error, refetch } = useExpenses({
    page,
    pageSize: FINANCE_PAGE_SIZE,
    search: debouncedSearch || undefined,
    expenseCategoryId: categoryId || undefined,
  })
  const expenses = data?.items ?? []

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleCategory = (value: string) => {
    setCategoryId(value)
    setPage(1)
  }

  return (
    <SectionCard
      title={t.expenses.journalTitle}
      actions={
        <>
          <SelectInput
            value={categoryId}
            onChange={(event) => handleCategory(event.target.value)}
            aria-label={t.expenses.categoryFilter}
            className="sm:w-48"
          >
            <option value="">{t.expenses.allCategories}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectInput>
          <SearchInput value={search} onChange={handleSearch} placeholder={t.expenses.searchPlaceholder} />
        </>
      }
    >
      <ListState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={expenses.length === 0}
        empty={
          <EmptyState
            icon={<MinusCircle className="w-5 h-5" />}
            title={t.expenses.emptyTitle}
            description={t.expenses.emptyDescription}
            action={emptyAction}
          />
        }
      >
        <ExpensesTable expenses={expenses} />
        <Pagination page={data?.page ?? page} totalPages={data?.totalPages ?? 0} onPageChange={setPage} />
      </ListState>
    </SectionCard>
  )
}
