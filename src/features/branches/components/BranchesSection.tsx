import { useState } from 'react'
import { Building2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/forms/SearchInput'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { Skeleton } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useBranchesList, useDeleteBranch } from '../hooks/useBranches'
import { BRANCHES_PAGE_SIZE, type BranchListItem } from '../types/branchTypes'
import { BranchCard } from './BranchCard'

const SKELETON_CARDS = 3
const GRID_CLASS = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'

interface BranchesSectionProps {
  selectedId: string | null
  onSelect: (branch: BranchListItem) => void
  onCreate: () => void
  onEdit: (branch: BranchListItem) => void
  onDeleted: (branchId: string) => void
}

export function BranchesSection({ selectedId, onSelect, onCreate, onEdit, onDeleted }: BranchesSectionProps) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [branchToDelete, setBranchToDelete] = useState<BranchListItem | null>(null)
  const debouncedSearch = useDebouncedValue(search.trim())
  const { data, isLoading, isError, error, refetch } = useBranchesList({
    page,
    pageSize: BRANCHES_PAGE_SIZE,
    search: debouncedSearch || undefined,
  })
  const deleteBranch = useDeleteBranch()

  const confirmDelete = () => {
    if (!branchToDelete) return
    const { id } = branchToDelete
    // `cannot_delete_branch_with_rooms` kabi xatolar global toast orqali ko'rsatiladi.
    deleteBranch.mutate(id, {
      onSuccess: () => {
        toast.success(t.branches.deleted)
        onDeleted(id)
      },
      onSettled: () => setBranchToDelete(null),
    })
  }

  return (
    <div className="space-y-4">
      <SearchInput
        className="sm:w-full sm:max-w-xs"
        value={search}
        placeholder={t.branches.searchPlaceholder}
        onChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
      />
      {isLoading && (
        <div className={GRID_CLASS}>
          {Array.from({ length: SKELETON_CARDS }, (_, index) => (
            <Skeleton key={index} className="h-36" />
          ))}
        </div>
      )}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {data && data.items.length === 0 && (
        <EmptyState
          icon={<Building2 className="w-5 h-5" />}
          title={t.branches.emptyTitle}
          description={t.branches.emptyDescription}
          action={
            <PermissionGuard permission={PERMISSIONS.BRANCHES.CREATE}>
              <Button variant="primary" size="sm" onClick={onCreate}>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.branches.newBranch}</span>
              </Button>
            </PermissionGuard>
          }
        />
      )}
      {data && data.items.length > 0 && (
        <>
          <div className={GRID_CLASS}>
            {data.items.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                isSelected={branch.id === selectedId}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={setBranchToDelete}
              />
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
      <ConfirmDialog
        isOpen={branchToDelete !== null}
        isLoading={deleteBranch.isPending}
        onClose={() => setBranchToDelete(null)}
        onConfirm={confirmDelete}
        description={interpolate(t.branches.deleteConfirm, { name: branchToDelete?.name ?? '' })}
      />
    </div>
  )
}
