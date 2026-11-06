import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calculator, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PageHeader } from '@/components/ui/PageHeader'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { interpolate, useTranslation } from '@/i18n'
import { formatDate } from '@/utils/formatters'
import { parseIsoDate } from '@/utils/dateUtils'
import { StudentListSkeleton } from '../components/StudentListSkeleton'
import { StudentRiskTable } from '../components/risk/StudentRiskTable'
import { StudentRiskToolbar, type StudentRiskFilterState } from '../components/risk/StudentRiskToolbar'
import { RISK_LEVEL_PARAM, STUDENT_RISK_PAGE_SIZE, parseRiskLevel } from '../constants/studentRiskConstants'
import { useRecalculateStudentRisk, useStudentRiskList, useStudentRiskSummary } from '../hooks/useStudentRisk'

/** Bosh sahifa vidjetidan kelgan `?level=` o'zgarsa sahifa shu daraja filtri bilan qayta quriladi. */
export function StudentRiskPage() {
  const [searchParams] = useSearchParams()
  const initialLevel = parseRiskLevel(searchParams.get(RISK_LEVEL_PARAM))
  return <StudentRiskView key={initialLevel ?? 'all'} initialFilters={{ search: '', level: initialLevel, branchId: '', groupId: '' }} />
}

function StudentRiskView({ initialFilters }: { initialFilters: StudentRiskFilterState }) {
  const { t } = useTranslation()
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const debouncedSearch = useDebouncedValue(filters.search.trim())

  const summaryQuery = useStudentRiskSummary()
  const listQuery = useStudentRiskList({
    page,
    pageSize: STUDENT_RISK_PAGE_SIZE,
    level: filters.level,
    branchId: filters.branchId || undefined,
    groupId: filters.groupId || undefined,
    search: debouncedSearch || undefined,
  })
  const recalculate = useRecalculateStudentRisk()
  const items = listQuery.data?.items ?? []
  const snapshotDate = summaryQuery.data?.snapshotDate ?? null
  const hasNoSnapshot = summaryQuery.isSuccess && snapshotDate === null

  const handleFilterChange = (patch: Partial<StudentRiskFilterState>) => {
    setFilters((current) => ({ ...current, ...patch }))
    setPage(1)
  }
  const confirmRecalculate = () => recalculate.mutate(undefined, { onSettled: () => setIsConfirmOpen(false) })

  const recalculateButton = (
    <PermissionGuard permission={PERMISSIONS.STUDENTS.RISK_RECALCULATE}>
      <Button variant="primary" size="sm" onClick={() => setIsConfirmOpen(true)} disabled={recalculate.isPending}>
        <Calculator className="w-3.5 h-3.5" />
        <span>{t.risk.recalculate}</span>
      </Button>
    </PermissionGuard>
  )

  return (
    <div className="space-y-5">
      <PageHeader title={t.risk.title} subtitle={t.risk.subtitle} actions={recalculateButton} />

      {snapshotDate && (
        <p className="text-2xs text-caption">
          {interpolate(t.risk.lastCalculated, { date: formatDate(parseIsoDate(snapshotDate)) })}
        </p>
      )}

      {hasNoSnapshot ? (
        <EmptyState
          title={t.risk.noSnapshotTitle}
          description={t.risk.noSnapshotDescription}
          icon={<ShieldCheck className="w-5 h-5" />}
          action={recalculateButton}
        />
      ) : (
        <ErrorBoundary>
          <StudentRiskToolbar filters={filters} onChange={handleFilterChange} />
          <div className="mt-5">
            {listQuery.isLoading && <StudentListSkeleton />}
            {listQuery.error && !listQuery.isLoading && (
              <ErrorState error={listQuery.error} onRetry={() => void listQuery.refetch()} />
            )}
            {!listQuery.isLoading && !listQuery.error && items.length === 0 && (
              <EmptyState
                title={t.risk.emptyTitle}
                description={t.risk.emptyDescription}
                icon={<ShieldCheck className="w-5 h-5" />}
              />
            )}
            {!listQuery.error && items.length > 0 && (
              <div>
                <StudentRiskTable items={items} />
                <Pagination page={page} totalPages={listQuery.data?.totalPages ?? 1} onPageChange={setPage} />
              </div>
            )}
          </div>
        </ErrorBoundary>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmRecalculate}
        isLoading={recalculate.isPending}
        variant="primary"
        title={t.risk.recalculateTitle}
        description={t.risk.recalculateConfirm}
        confirmLabel={t.risk.recalculate}
      />
    </div>
  )
}
