import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useTranslation } from '@/i18n'
import type { CourseListItem, SubjectItem } from '../types/courseTypes'
import { useCourseDetail } from '../hooks/useCourses'
import { CourseForm } from './CourseForm'

interface CourseModalProps {
  isOpen: boolean
  onClose: () => void
  subjects: SubjectItem[]
  courseToEdit?: CourseListItem | null
}

/** Tahrirlashda tavsif ro'yxatda yo'qligi uchun kurs to'liq yuklanadi, so'ng forma `key` bilan quriladi. */
export function CourseModal({ isOpen, onClose, subjects, courseToEdit }: CourseModalProps) {
  const { t } = useTranslation()
  const detail = useCourseDetail(isOpen ? courseToEdit?.id : null)
  const isEditing = Boolean(courseToEdit)

  const renderBody = () => {
    if (!isEditing) return <CourseForm subjects={subjects} onCancel={onClose} onSaved={onClose} />
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
    return <CourseForm key={detail.data.id} course={detail.data} subjects={subjects} onCancel={onClose} onSaved={onClose} />
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t.courses.editTitle : t.courses.createTitle}
      description={t.courses.modalDescription}
      maxWidth="lg"
    >
      {renderBody()}
    </Modal>
  )
}
