import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { interpolate, useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { addDaysIsoDate, todayIsoDate } from '@/utils/dateUtils'
import { emptyToNull } from '@/utils/formUtils'
import { useFreezeStudent } from '../hooks/useStudents'
import { createFreezeSchema, type FreezeFormValues } from '../schemas/studentSchemas'
import type { StudentDetail, StudentListItem } from '../types/studentTypes'

interface StudentFreezeModalProps {
  student: Pick<StudentListItem | StudentDetail, 'id' | 'fullName'>
  onClose: () => void
}

const FORM_ID = 'student-freeze-form'
const DEFAULT_FREEZE_DAYS = 14

export function StudentFreezeModal({ student, onClose }: StudentFreezeModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createFreezeSchema(t), [t])
  const freezeMutation = useFreezeStudent()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FreezeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fromDate: todayIsoDate(), toDate: addDaysIsoDate(DEFAULT_FREEZE_DAYS), reason: '' },
  })

  const onSubmit = (values: FreezeFormValues) => {
    freezeMutation.mutate(
      {
        studentId: student.id,
        fromDate: values.fromDate,
        toDate: values.toDate,
        reason: emptyToNull(values.reason),
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t.students.freeze.title}
      description={interpolate(t.students.freeze.description, { name: student.fullName })}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} variant="danger" isLoading={freezeMutation.isPending}>
            {t.students.freeze.submit}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="p-3 bg-warning-soft border border-warning-border rounded-md text-2xs text-warning-ink">
          {t.students.freeze.note}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label={t.students.freeze.fromDate} htmlFor="freeze-from" required>
            <Input id="freeze-from" type="date" error={errors.fromDate?.message} {...register('fromDate')} />
          </FormField>
          <FormField label={t.students.freeze.toDate} htmlFor="freeze-to" required>
            <Input id="freeze-to" type="date" error={errors.toDate?.message} {...register('toDate')} />
          </FormField>
        </div>

        <FormField label={t.students.freeze.reason} htmlFor="freeze-reason">
          <Input id="freeze-reason" placeholder={t.students.freeze.reasonPlaceholder} {...register('reason')} />
        </FormField>
      </form>
    </Modal>
  )
}
