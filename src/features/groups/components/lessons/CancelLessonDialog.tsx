import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { interpolate, useTranslation } from '@/i18n'
import { formatDate } from '@/utils/formatters'
import { FormField } from '@/components/forms/FormField'
import { parseIsoDate } from '@/utils/dateUtils'
import type { LessonItem } from '../../types/groupTypes'
import { useCancelLesson } from '../../hooks/useGroupLessons'
import { createCancelLessonSchema, type CancelLessonFormValues } from '../../utils/lessonSchemas'

const FORM_ID = 'cancel-lesson-form'

interface CancelLessonDialogProps {
  lesson: LessonItem
  onClose: () => void
}

/** 1-qadam: sabab (Zod bilan); 2-qadam: majburiy `ConfirmDialog`. */
export function CancelLessonDialog({ lesson, onClose }: CancelLessonDialogProps) {
  const { t } = useTranslation()
  const [confirmedReason, setConfirmedReason] = useState<string | null>(null)
  const schema = useMemo(() => createCancelLessonSchema(t), [t])
  const cancelMutation = useCancelLesson()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelLessonFormValues>({ resolver: zodResolver(schema), defaultValues: { reason: '' } })

  const onSubmit = handleSubmit((values) => setConfirmedReason(values.reason.trim()))

  if (confirmedReason !== null) {
    return (
      <ConfirmDialog
        isOpen
        onClose={() => setConfirmedReason(null)}
        onConfirm={() => cancelMutation.mutate({ lessonId: lesson.id, reason: confirmedReason }, { onSuccess: onClose })}
        isLoading={cancelMutation.isPending}
        title={t.groups.cancelLessonTitle}
        confirmLabel={t.groups.cancelConfirmLabel}
        description={interpolate(t.groups.cancelConfirm, {
          date: formatDate(parseIsoDate(lesson.lessonDate)),
          reason: confirmedReason,
        })}
      />
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t.groups.cancelLessonTitle}
      maxWidth="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} variant="danger" size="sm">
            {t.groups.continue}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} noValidate>
        <FormField label={t.groups.cancelReason} htmlFor="cancel-reason" required>
          <Input
            id="cancel-reason"
            autoFocus
            placeholder={t.groups.cancelReasonPlaceholder}
            {...register('reason')}
            error={errors.reason?.message}
          />
        </FormField>
      </form>
    </Modal>
  )
}
