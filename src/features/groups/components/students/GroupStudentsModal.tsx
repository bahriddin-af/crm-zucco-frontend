import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { interpolate, useTranslation } from '@/i18n'
import type { GroupListItem } from '../../types/groupTypes'
import { GroupStudentsList, type PendingStudentStatus } from './GroupStudentsList'
import { StudentStatusConfirmDialog } from './StudentStatusConfirmDialog'

interface GroupStudentsModalProps {
  group: GroupListItem
  onClose: () => void
}

export function GroupStudentsModal({ group, onClose }: GroupStudentsModalProps) {
  const { t } = useTranslation()
  const [pending, setPending] = useState<PendingStudentStatus | null>(null)

  return (
    <>
      <Modal
        isOpen={pending === null}
        onClose={onClose}
        title={interpolate(t.groups.studentsTitle, { name: group.name })}
        maxWidth="lg"
      >
        <GroupStudentsList groupId={group.id} onChangeStatus={setPending} />
      </Modal>
      <StudentStatusConfirmDialog groupId={group.id} pending={pending} onClose={() => setPending(null)} />
    </>
  )
}
