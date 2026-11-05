import { useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import type { SubjectItem } from '../types/courseTypes'
import { useDeleteSubject, useSubjectsList } from '../hooks/useCourses'
import { SubjectModal } from './SubjectModal'

type SubjectDialog = { type: 'edit'; subject: SubjectItem | null } | { type: 'delete'; subject: SubjectItem } | null

const SKELETON_CHIPS = 4

export function SubjectsPanel() {
  const { t } = useTranslation()
  const [dialog, setDialog] = useState<SubjectDialog>(null)
  const subjectsQuery = useSubjectsList()
  const deleteMutation = useDeleteSubject()
  const subjects = subjectsQuery.data ?? []
  const close = () => setDialog(null)

  const renderList = () => {
    if (subjectsQuery.isLoading) {
      return (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: SKELETON_CHIPS }, (_, index) => (
            <Skeleton key={index} className="h-8 w-32" />
          ))}
        </div>
      )
    }
    if (subjectsQuery.isError) return <ErrorState error={subjectsQuery.error} onRetry={() => void subjectsQuery.refetch()} />
    if (subjects.length === 0) return <p className="text-[11px] text-caption">{t.courses.subjectsEmpty}</p>
    return (
      <ul className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <li key={subject.id} className="flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-md border border-border bg-canvas text-xs">
            <span className="font-semibold text-heading">{subject.name}</span>
            <span className="text-[11px] text-caption">{interpolate(t.courses.subjectCourses, { count: subject.courseCount })}</span>
            <PermissionGuard permission={PERMISSIONS.COURSES.UPDATE}>
              <Button variant="ghost" size="icon" className="h-6 w-6" aria-label={t.courses.edit} onClick={() => setDialog({ type: 'edit', subject })}>
                <Edit2 className="w-3 h-3" />
              </Button>
            </PermissionGuard>
            <PermissionGuard permission={PERMISSIONS.COURSES.DELETE}>
              <Button variant="ghost" size="icon" className="h-6 w-6" aria-label={t.courses.delete} onClick={() => setDialog({ type: 'delete', subject })}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </PermissionGuard>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className="bg-white p-3.5 rounded-lg border border-border shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold text-heading">{t.courses.subjectsTitle}</h2>
        <PermissionGuard permission={PERMISSIONS.COURSES.CREATE}>
          <Button variant="outline" size="sm" onClick={() => setDialog({ type: 'edit', subject: null })}>
            <Plus className="w-3.5 h-3.5" />
            <span>{t.courses.addSubject}</span>
          </Button>
        </PermissionGuard>
      </div>
      {renderList()}

      {dialog?.type === 'edit' && <SubjectModal subject={dialog.subject} onClose={close} />}
      <ConfirmDialog
        isOpen={dialog?.type === 'delete'}
        onClose={close}
        onConfirm={() => dialog?.type === 'delete' && deleteMutation.mutate(dialog.subject.id, { onSuccess: close })}
        isLoading={deleteMutation.isPending}
        title={t.courses.deleteSubjectTitle}
        description={interpolate(t.courses.deleteSubjectDescription, { name: dialog?.subject?.name ?? '' })}
      />
    </section>
  )
}
