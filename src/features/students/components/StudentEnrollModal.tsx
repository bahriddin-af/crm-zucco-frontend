import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { interpolate, useTranslation } from '@/i18n'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import { GROUP_STATUS } from '@/features/groups/types/groupTypes'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { todayIsoDate } from '@/utils/dateUtils'
import { useEnrollStudent } from '../hooks/useStudents'
import { createEnrollSchema, type EnrollFormValues } from '../schemas/studentSchemas'
import type { StudentDetail, StudentListItem } from '../types/studentTypes'

interface StudentEnrollModalProps {
  student: Pick<StudentListItem | StudentDetail, 'id' | 'fullName'>
  onClose: () => void
}

const FORM_ID = 'student-enroll-form'

export function StudentEnrollModal({ student, onClose }: StudentEnrollModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createEnrollSchema(t), [t])
  const enrollMutation = useEnrollStudent()
  const { data: groupsData } = useGroupsList()
  const groups = (groupsData?.items ?? []).filter((group) => group.status !== GROUP_STATUS.Completed)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnrollFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { groupId: '', joinedDate: todayIsoDate(), customPrice: '' },
  })

  const onSubmit = (values: EnrollFormValues) => {
    enrollMutation.mutate(
      {
        groupId: values.groupId,
        studentId: student.id,
        joinedDate: values.joinedDate,
        customPrice: values.customPrice ? Number(values.customPrice) : null,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t.students.enroll.title}
      description={interpolate(t.students.enroll.description, { name: student.fullName })}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} variant="primary" isLoading={enrollMutation.isPending}>
            {t.students.enroll.submit}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label={t.students.enroll.group} htmlFor="enroll-group" required error={errors.groupId?.message}>
          <SelectInput id="enroll-group" {...register('groupId')}>
            <option value="">{t.students.enroll.groupPlaceholder}</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} — {group.courseName} ({group.teacherName})
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label={t.students.enroll.joinedDate} htmlFor="enroll-date" required>
          <Input id="enroll-date" type="date" error={errors.joinedDate?.message} {...register('joinedDate')} />
        </FormField>

        <FormField label={t.students.enroll.customPrice} htmlFor="enroll-price">
          <Input
            id="enroll-price"
            inputMode="decimal"
            placeholder={t.students.enroll.customPricePlaceholder}
            error={errors.customPrice?.message}
            {...register('customPrice')}
          />
        </FormField>
      </form>
    </Modal>
  )
}
