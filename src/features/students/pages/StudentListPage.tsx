import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, RefreshCw, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { StudentListToolbar } from '../components/StudentListToolbar'
import { StudentsTable } from '../components/StudentsTable'
import { StudentListSkeleton } from '../components/StudentListSkeleton'
import { StudentModal } from '../components/StudentModal'
import { StudentFreezeModal } from '../components/StudentFreezeModal'
import { StudentEnrollModal } from '../components/StudentEnrollModal'
import { STUDENT_SEARCH_PARAM, STUDENTS_PAGE_SIZE } from '../constants/studentConstants'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PageHeader } from '@/components/ui/PageHeader'
import { useDeleteStudent, useStudentsList, useUnfreezeStudent } from '../hooks/useStudents'
import type { StudentListItem, StudentStatus } from '../types/studentTypes'

type StudentDialog =
  | { kind: 'create' }
  | { kind: 'enroll' | 'freeze' | 'delete'; student: StudentListItem }
  | null

/** Topbar qidiruvidan kelgan `?search=` qiymati o'zgarsa ro'yxat yangi boshlang'ich qidiruv bilan qayta quriladi. */
export function StudentListPage() {
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get(STUDENT_SEARCH_PARAM) ?? ''
  return <StudentListView key={initialSearch} initialSearch={initialSearch} />
}

function StudentListView({ initialSearch }: { initialSearch: string }) {
  const { t } = useTranslation()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState<StudentStatus | undefined>()
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<StudentDialog>(null)
  const closeDialog = () => setDialog(null)
  const debouncedSearch = useDebouncedValue(search.trim())

  const { data, isLoading, error, refetch, isFetching } = useStudentsList({
    page,
    pageSize: STUDENTS_PAGE_SIZE,
    status,
    search: debouncedSearch || undefined,
  })
  const deleteMutation = useDeleteStudent()
  const unfreezeMutation = useUnfreezeStudent()
  const students = data?.items ?? []

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }
  const handleStatusChange = (value?: StudentStatus) => {
    setStatus(value)
    setPage(1)
  }
  const confirmDelete = () => {
    if (dialog?.kind !== 'delete') return
    deleteMutation.mutate(dialog.student.id, { onSuccess: closeDialog })
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.students.title}
        subtitle={t.students.subtitle}
        actions={
          <>
            <Button size="sm" onClick={() => void refetch()} disabled={isFetching} title={t.common.refresh} aria-label={t.common.refresh}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <PermissionGuard permission={PERMISSIONS.STUDENTS.CREATE}>
              <Button variant="primary" size="sm" onClick={() => setDialog({ kind: 'create' })}>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.students.addNew}</span>
              </Button>
            </PermissionGuard>
          </>
        }
      />

      <StudentListToolbar search={search} onSearchChange={handleSearchChange} status={status} onStatusChange={handleStatusChange} />

      {isLoading && <StudentListSkeleton />}
      {error && !isLoading && <ErrorState error={error} onRetry={() => void refetch()} />}
      {!isLoading && !error && students.length === 0 && (
        <EmptyState
          title={t.students.empty.title}
          description={debouncedSearch ? interpolate(t.students.empty.searchDescription, { search: debouncedSearch }) : t.students.empty.description}
          icon={<UserPlus className="w-5 h-5" />}
          action={
            <PermissionGuard permission={PERMISSIONS.STUDENTS.CREATE}>
              <Button variant="primary" size="sm" onClick={() => setDialog({ kind: 'create' })}>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.students.addNew}</span>
              </Button>
            </PermissionGuard>
          }
        />
      )}
      {!error && students.length > 0 && (
        <div>
          <StudentsTable
            students={students}
            onEnroll={(student) => setDialog({ kind: 'enroll', student })}
            onFreeze={(student) => setDialog({ kind: 'freeze', student })}
            onUnfreeze={(student) => unfreezeMutation.mutate(student.id)}
            onDelete={(student) => setDialog({ kind: 'delete', student })}
          />
          <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
        </div>
      )}

      {dialog?.kind === 'create' && <StudentModal onClose={closeDialog} />}
      {dialog?.kind === 'enroll' && <StudentEnrollModal student={dialog.student} onClose={closeDialog} />}
      {dialog?.kind === 'freeze' && <StudentFreezeModal student={dialog.student} onClose={closeDialog} />}
      <ConfirmDialog
        isOpen={dialog?.kind === 'delete'}
        onClose={closeDialog}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        description={dialog?.kind === 'delete' ? interpolate(t.students.deleteConfirm, { name: dialog.student.fullName }) : undefined}
      />
    </div>
  )
}
