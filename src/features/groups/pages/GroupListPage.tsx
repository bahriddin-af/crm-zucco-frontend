import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { GROUPS_PAGE_SIZE, type GroupListItem } from '../types/groupTypes'
import { useDeleteGroup, useGroupsList } from '../hooks/useGroups'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PageHeader } from '@/components/ui/PageHeader'
import { GroupModal } from '../components/GroupModal'
import { GroupsGrid } from '../components/GroupsGrid'
import { GroupsToolbar, type GroupsToolbarValue } from '../components/GroupsToolbar'
import { GroupLessonsModal } from '../components/lessons/GroupLessonsModal'
import { GroupStudentsModal } from '../components/students/GroupStudentsModal'
import type { GroupAction } from '../components/GroupCardActions'

type DialogState = { type: GroupAction | 'create'; group: GroupListItem | null } | null

const INITIAL_FILTERS: GroupsToolbarValue = { search: '', courseId: '', teacherId: '' }

export function GroupListPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<GroupsToolbarValue>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<DialogState>(null)
  const search = useDebouncedValue(filters.search.trim())

  const groupsQuery = useGroupsList({
    page,
    pageSize: GROUPS_PAGE_SIZE,
    search: search || undefined,
    status: filters.status,
    courseId: filters.courseId || undefined,
    teacherId: filters.teacherId || undefined,
  })
  const deleteMutation = useDeleteGroup()

  const hasFilters = Boolean(search || filters.status || filters.courseId || filters.teacherId)
  const closeDialog = () => setDialog(null)
  const openCreate = () => setDialog({ type: 'create', group: null })

  const handleFiltersChange = (next: GroupsToolbarValue) => {
    setFilters(next)
    setPage(1)
  }

  const handleConfirmDelete = () => {
    if (!dialog?.group) return
    deleteMutation.mutate(dialog.group.id, { onSuccess: closeDialog })
  }

  const activeGroup = dialog?.group ?? null

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.groups.title}
        subtitle={t.groups.subtitle}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void groupsQuery.refetch()}
              title={t.groups.refresh}
              aria-label={t.groups.refresh}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <PermissionGuard permission={PERMISSIONS.GROUPS.CREATE}>
              <Button variant="primary" size="sm" onClick={openCreate}>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.groups.create}</span>
              </Button>
            </PermissionGuard>
          </>
        }
      />

      <GroupsToolbar value={filters} onChange={handleFiltersChange} />

      <ErrorBoundary>
        <GroupsGrid
          data={groupsQuery.data}
          isLoading={groupsQuery.isLoading}
          error={groupsQuery.isError ? groupsQuery.error : null}
          onRetry={() => void groupsQuery.refetch()}
          hasFilters={hasFilters}
          onCreate={openCreate}
          onAction={(type, group) => setDialog({ type, group })}
          onPageChange={setPage}
        />
      </ErrorBoundary>

      <GroupModal
        isOpen={dialog?.type === 'create' || dialog?.type === 'edit'}
        onClose={closeDialog}
        groupToEdit={dialog?.type === 'edit' ? activeGroup : null}
      />

      <ConfirmDialog
        isOpen={dialog?.type === 'delete'}
        onClose={closeDialog}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        title={t.groups.deleteTitle}
        description={interpolate(t.groups.deleteDescription, { name: activeGroup?.name ?? '' })}
      />

      {dialog?.type === 'lessons' && activeGroup && <GroupLessonsModal group={activeGroup} onClose={closeDialog} />}
      {dialog?.type === 'students' && activeGroup && <GroupStudentsModal group={activeGroup} onClose={closeDialog} />}
    </div>
  )
}
