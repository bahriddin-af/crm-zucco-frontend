import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { emptyToNull, normalizePhone } from '@/utils/formUtils'
import { useSaveStudent } from '../hooks/useStudents'
import { createStudentSchema, type StudentFormValues } from '../schemas/studentSchemas'
import { GENDER, GENDER_VALUES, STUDENT_STATUS, STUDENT_STATUS_VALUES, type StudentDetail } from '../types/studentTypes'

interface StudentModalProps {
  onClose: () => void
  /** Berilsa — tahrirlash rejimi. */
  student?: StudentDetail
}

const FORM_ID = 'student-form'

export function StudentModal({ onClose, student }: StudentModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createStudentSchema(t), [t])
  const saveMutation = useSaveStudent()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: student?.fullName ?? '',
      phone: student?.phone ?? '',
      birthDate: student?.birthDate ?? '',
      gender: student?.gender ?? GENDER.Male,
      status: student?.status ?? STUDENT_STATUS.Active,
      address: student?.address ?? '',
      note: student?.note ?? '',
    },
  })

  const onSubmit = (values: StudentFormValues) => {
    const gender = GENDER_VALUES.find((value) => value === values.gender)
    const status = STUDENT_STATUS_VALUES.find((value) => value === values.status)
    saveMutation.mutate(
      {
        id: student?.id ?? null,
        fullName: values.fullName,
        phone: normalizePhone(values.phone),
        birthDate: emptyToNull(values.birthDate),
        gender,
        status,
        address: emptyToNull(values.address),
        note: emptyToNull(values.note),
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={student ? t.students.form.editTitle : t.students.form.createTitle}
      description={t.students.form.description}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} variant="primary" isLoading={saveMutation.isPending}>
            {student ? t.common.save : t.students.form.submitCreate}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label={t.students.form.fullName} htmlFor="student-full-name" required>
          <Input
            id="student-full-name"
            placeholder={t.students.form.fullNamePlaceholder}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label={t.students.form.phone} htmlFor="student-phone" required>
            <Input id="student-phone" type="tel" error={errors.phone?.message} {...register('phone')} />
          </FormField>
          <FormField label={t.students.form.birthDate} htmlFor="student-birth-date">
            <Input id="student-birth-date" type="date" {...register('birthDate')} />
          </FormField>
          <FormField label={t.students.form.gender} htmlFor="student-gender" error={errors.gender?.message}>
            <SelectInput id="student-gender" {...register('gender', { valueAsNumber: true })}>
              {GENDER_VALUES.map((gender) => (
                <option key={gender} value={gender}>
                  {t.students.genders[gender]}
                </option>
              ))}
            </SelectInput>
          </FormField>
          <FormField label={t.students.form.status} htmlFor="student-status" error={errors.status?.message}>
            <SelectInput id="student-status" {...register('status', { valueAsNumber: true })}>
              {STUDENT_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {t.students.statuses[status]}
                </option>
              ))}
            </SelectInput>
          </FormField>
        </div>

        <FormField label={t.students.form.address} htmlFor="student-address">
          <Input id="student-address" placeholder={t.students.form.addressPlaceholder} {...register('address')} />
        </FormField>

        <FormField label={t.students.form.note} htmlFor="student-note">
          <Input id="student-note" placeholder={t.students.form.notePlaceholder} {...register('note')} />
        </FormField>
      </form>
    </Modal>
  )
}
