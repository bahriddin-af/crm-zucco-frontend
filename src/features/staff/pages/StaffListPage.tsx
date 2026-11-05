import { useState } from 'react'
import { Plus, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { SearchInput } from '@/components/forms/SearchInput'
import { SelectInput } from '@/components/forms/SelectInput'
import { PageHeader } from '@/components/ui/PageHeader'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { StaffModal } from '../components/StaffModal'
import { StaffTable } from '../components/StaffTable'
import { useDeleteStaff, useStaffList } from '../hooks/useStaff'
import { STAFF_ROLE_TYPE_VALUES, type StaffListItem, type StaffRoleType } from '../types/staffTypes'

const STAFF_PAGE_SIZE = 20
const SKELETON_ROWS = 4

type StaffDialog = { kind: 'create' } | { kind: 'edit' | 'delete'; staff: StaffListItem } | null

export function StaffListPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<StaffRoleType | undefined>()
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<StaffDialog>(null)
  const closeDialog = () => setDialog(null)
  const debouncedSearch = useDebouncedValue(search.trim())

  const { data, isLoading, error, refetch } = useStaffList(page, STAFF_PAGE_SIZE, debouncedSearch, role)
  const deleteMutation = useDeleteStaff()
  const staff = data?.items ?? []

  const handleRoleChange = (value: string) => {
    setRole(STAFF_ROLE_TYPE_VALUES.find((item) => String(item) === value))
    setPage(1)
  }
  const confirmDelete = () => {
    if (dialog?.kind === 'delete') deleteMutation.mutate(dialog.staff.id, { onSuccess: closeDialog })
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.staff.title}
        subtitle={t.staff.subtitle}
        actions={
          <PermissionGuard permission={PERMISSIONS.STAFF.CREATE}>
            <Button variant="primary" size="sm" onClick={() => setDialog({ kind: 'create' })}>
              <Plus className="w-3.5 h-3.5" />
              <span>{t.staff.addNew}</span>
            </Button>
          </PermissionGuard>
        }
      />

      <div className="bg-white p-3 rounded-lg border border-border shadow-xs flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder={t.staff.searchPlaceholder}
          className="sm:w-72"
        />
        <SelectInput
          value={role ?? ''}
          onChange={(e) => handleRoleChange(e.target.value)}
          aria-label={t.staff.roleFilter}
          className="sm:w-60 min-h-[32px]"
        >
          <option value="">{t.staff.allRoles}</option>
          {STAFF_ROLE_TYPE_VALUES.map((value) => (
            <option key={value} value={value}>
              {t.staff.roleTypes[value]}
            </option>
          ))}
        </SelectInput>
      </div>

      {isLoading && (
        <ListSkeleton rows={SKELETON_ROWS} rowClassName="h-12 w-full" className="bg-white border border-border rounded-xl p-6 space-y-3" />
      )}
      {error && !isLoading && <ErrorState error={error} onRetry={() => void refetch()} />}
      {!isLoading && !error && staff.length === 0 && (
        <EmptyState title={t.staff.empty.title} description={t.staff.empty.description} icon={<UserCheck className="w-5 h-5" />} />
      )}
      {!error && staff.length > 0 && (
        <div>
          <StaffTable
            staff={staff}
            onEdit={(member) => setDialog({ kind: 'edit', staff: member })}
            onDelete={(member) => setDialog({ kind: 'delete', staff: member })}
          />
          <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
        </div>
      )}

      {dialog?.kind === 'create' && <StaffModal onClose={closeDialog} />}
      {dialog?.kind === 'edit' && <StaffModal staffId={dialog.staff.id} onClose={closeDialog} />}
      <ConfirmDialog
        isOpen={dialog?.kind === 'delete'}
        onClose={closeDialog}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        description={dialog?.kind === 'delete' ? interpolate(t.staff.deleteConfirm, { name: dialog.staff.fullName }) : undefined}
      />
    </div>
  )
}
