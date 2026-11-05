import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { COURSE_LEVEL_VALUES, COURSE_STATUS_VALUES, type CourseResponse, type SubjectItem } from '../types/courseTypes'
import { useSaveCourse } from '../hooks/useCourses'
import {
  COURSE_FORM_DEFAULTS,
  courseToFormValues,
  createCourseSchema,
  toCourseRequest,
  type CourseFormValues,
} from '../utils/courseSchemas'
import { CourseNumberFields } from './CourseNumberFields'

interface CourseFormProps {
  course?: CourseResponse
  subjects: SubjectItem[]
  onCancel: () => void
  onSaved: () => void
}

export function CourseForm({ course, subjects, onCancel, onSaved }: CourseFormProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createCourseSchema(t), [t])
  const saveMutation = useSaveCourse(onSaved)
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: course ? courseToFormValues(course) : { ...COURSE_FORM_DEFAULTS, subjectId: subjects[0]?.id ?? '' },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const onSubmit = handleSubmit((values) => saveMutation.mutate(toCourseRequest(values, course?.id)))

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label={t.courses.fields.subject} htmlFor="course-subject" required error={errors.subjectId?.message}>
          <SelectInput id="course-subject" hasError={Boolean(errors.subjectId)} {...register('subjectId')}>
            <option value="">{t.courses.select}</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label={t.courses.fields.name} htmlFor="course-name" required>
          <Input
            id="course-name"
            placeholder={t.courses.fields.namePlaceholder}
            {...register('name')}
            error={errors.name?.message}
          />
        </FormField>

        <FormField label={t.courses.fields.level} htmlFor="course-level" error={errors.level?.message}>
          <SelectInput id="course-level" {...register('level', { valueAsNumber: true })}>
            {COURSE_LEVEL_VALUES.map((level) => (
              <option key={level} value={level}>
                {t.courses.levels[level]}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label={t.courses.fields.status} htmlFor="course-status" error={errors.status?.message}>
          <SelectInput id="course-status" {...register('status', { valueAsNumber: true })}>
            {COURSE_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {t.courses.statuses[status]}
              </option>
            ))}
          </SelectInput>
        </FormField>
      </div>

      <CourseNumberFields register={register} errors={errors} />

      <FormField label={t.courses.fields.description} htmlFor="course-description">
        <Input id="course-description" {...register('description')} error={errors.description?.message} />
      </FormField>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t.common.cancel}
        </Button>
        <Button type="submit" variant="primary" isLoading={saveMutation.isPending}>
          {course ? t.common.save : t.courses.submitCreate}
        </Button>
      </div>
    </form>
  )
}
