import { useState } from 'react'
import { CalendarX } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import type { GroupListItem, LessonItem } from '../../types/groupTypes'
import { useGroupLessons } from '../../hooks/useGroupLessons'
import { CancelLessonDialog } from './CancelLessonDialog'
import { GenerateScheduleForm } from './GenerateScheduleForm'
import { LessonRow } from './LessonRow'

const SKELETON_ROWS = 4

interface GroupLessonsModalProps {
  group: GroupListItem
  onClose: () => void
}

export function GroupLessonsModal({ group, onClose }: GroupLessonsModalProps) {
  const { t } = useTranslation()
  const [cancelTarget, setCancelTarget] = useState<LessonItem | null>(null)
  const lessonsQuery = useGroupLessons(group.id)
  const lessons = lessonsQuery.data ?? []

  const renderLessons = () => {
    if (lessonsQuery.isLoading) {
      return (
        <ListSkeleton rows={SKELETON_ROWS} rowClassName="h-10 w-full" />
      )
    }
    if (lessonsQuery.isError) {
      return <ErrorState error={lessonsQuery.error} onRetry={() => void lessonsQuery.refetch()} />
    }
    if (lessons.length === 0) {
      return (
        <EmptyState
          title={t.groups.lessonsEmptyTitle}
          description={t.groups.lessonsEmptyDescription}
          icon={<CalendarX className="w-5 h-5" />}
        />
      )
    }
    return (
      <ul className="divide-y divide-divider max-h-[50vh] overflow-y-auto pr-1">
        {lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} onCancel={setCancelTarget} />
        ))}
      </ul>
    )
  }

  return (
    <>
      <Modal
        isOpen={cancelTarget === null}
        onClose={onClose}
        title={interpolate(t.groups.lessonsTitle, { name: group.name })}
        maxWidth="xl"
      >
        <div className="space-y-4">
          <PermissionGuard permission={PERMISSIONS.GROUPS.UPDATE}>
            <GenerateScheduleForm groupId={group.id} />
          </PermissionGuard>
          {renderLessons()}
        </div>
      </Modal>
      {cancelTarget && <CancelLessonDialog lesson={cancelTarget} onClose={() => setCancelTarget(null)} />}
    </>
  )
}
