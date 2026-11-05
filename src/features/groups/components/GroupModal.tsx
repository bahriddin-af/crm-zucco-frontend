import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useTranslation } from '@/i18n'
import type { GroupListItem } from '../types/groupTypes'
import { useGroupDetail } from '../hooks/useGroups'
import { GroupForm } from './group-form/GroupForm'

interface GroupModalProps {
  isOpen: boolean
  onClose: () => void
  groupToEdit?: GroupListItem | null
}

/**
 * Tahrirlashda ro'yxat elementida yo'q maydonlar (sana, billing) uchun guruh to'liq yuklanadi;
 * forma ma'lumot kelgandan keyin `key` bilan yangidan quriladi (effect'siz).
 */
export function GroupModal({ isOpen, onClose, groupToEdit }: GroupModalProps) {
  const { t } = useTranslation()
  const editId = isOpen ? groupToEdit?.id : null
  const detail = useGroupDetail(editId)
  const isEditing = Boolean(groupToEdit)

  const renderBody = () => {
    if (!isEditing) return <GroupForm onCancel={onClose} onSaved={onClose} />
    if (detail.isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      )
    }
    if (detail.isError || !detail.data) return <ErrorState error={detail.error} onRetry={() => void detail.refetch()} />
    return <GroupForm key={detail.data.id} group={detail.data} onCancel={onClose} onSaved={onClose} />
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t.groups.editTitle : t.groups.createTitle}
      description={t.groups.modalDescription}
      maxWidth="xl"
    >
      {renderBody()}
    </Modal>
  )
}
