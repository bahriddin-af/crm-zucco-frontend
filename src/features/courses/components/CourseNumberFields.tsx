import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import type { CourseFormValues } from '../utils/courseSchemas'

type NumberFieldName = 'durationMonths' | 'lessonsPerMonth' | 'lessonDurationMinutes' | 'basePrice'

const NUMBER_FIELDS: readonly NumberFieldName[] = ['durationMonths', 'lessonsPerMonth', 'lessonDurationMinutes', 'basePrice']

interface CourseNumberFieldsProps {
  register: UseFormRegister<CourseFormValues>
  errors: FieldErrors<CourseFormValues>
}

/** Davomiylik, darslar soni, dars uzunligi va narx (hammasi musbat/manfiy bo'lmagan sonlar). */
export function CourseNumberFields({ register, errors }: CourseNumberFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {NUMBER_FIELDS.map((name) => {
        const isPrice = name === 'basePrice'
        return (
          <FormField key={name} label={t.courses.fields[name]} htmlFor={`course-${name}`} required>
            <Input
              id={`course-${name}`}
              type="number"
              min={isPrice ? 0 : 1}
              step={isPrice ? 'any' : 1}
              {...register(name, { valueAsNumber: true })}
              error={errors[name]?.message}
            />
          </FormField>
        )
      })}
    </div>
  )
}
