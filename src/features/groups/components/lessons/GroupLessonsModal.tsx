import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import type { GroupListItem, LessonItem } from '../../types/groupTypes'
import { CancelLessonDialog } from './CancelLessonDialog'
import { GenerateScheduleForm } from './GenerateScheduleForm'
import { GroupLessonsList } from './GroupLessonsList'

interface GroupLessonsModalProps {
  group: GroupListItem
  onClose: () => void
}

export function GroupLessonsModal({ group, onClose }: GroupLessonsModalProps) {
  const { t } = useTranslation()
  const [cancelTarget, setCancelTarget] = useState<LessonItem | null>(null)

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
          <GroupLessonsList groupId={group.id} onCancel={setCancelTarget} />
        </div>
      </Modal>
      {cancelTarget && <CancelLessonDialog lesson={cancelTarget} onClose={() => setCancelTarget(null)} />}
    </>
  )
}
