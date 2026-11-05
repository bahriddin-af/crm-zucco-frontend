import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import type { SubjectItem } from '../types/courseTypes'
import { useSaveSubject } from '../hooks/useCourses'
import { createSubjectSchema, type SubjectFormValues } from '../utils/courseSchemas'

interface SubjectModalProps {
  subject: SubjectItem | null
  onClose: () => void
}

/** Yo'nalishni yaratish/tahrirlash (upsert). Har ochilishda yangidan mount qilinadi. */
export function SubjectModal({ subject, onClose }: SubjectModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createSubjectSchema(t), [t])
  const saveMutation = useSaveSubject(onClose)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: subject?.name ?? '', description: subject?.description ?? '' },
  })

  const onSubmit = handleSubmit((values) => {
    const description = values.description.trim()
    saveMutation.mutate({
      id: subject?.id ?? null,
      name: values.name.trim(),
      description: description === '' ? null : description,
    })
  })

  return (
    <Modal isOpen onClose={onClose} title={subject ? t.courses.editSubjectTitle : t.courses.createSubjectTitle} maxWidth="sm">
      <form onSubmit={onSubmit} noValidate className="space-y-3">
        <FormField label={t.courses.subjectName} htmlFor="subject-name" required>
          <Input
            id="subject-name"
            autoFocus
            placeholder={t.courses.subjectNamePlaceholder}
            {...register('name')}
            error={errors.name?.message}
          />
        </FormField>
        <FormField label={t.courses.subjectDescription} htmlFor="subject-description">
          <Input id="subject-description" {...register('description')} error={errors.description?.message} />
        </FormField>
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={saveMutation.isPending}>
            {t.common.save}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
