import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { useTranslation } from '@/i18n'
import type { StudentFormValues, StudentParentFormValues } from '../schemas/studentSchemas'
import { PARENT_RELATIONSHIP, PARENT_RELATIONSHIP_VALUES } from '../types/studentTypes'

interface StudentParentsFieldsProps {
  control: Control<StudentFormValues>
  register: UseFormRegister<StudentFormValues>
  errors: FieldErrors<StudentFormValues>
}

const EMPTY_PARENT: StudentParentFormValues = {
  id: null,
  fullName: '',
  phone: '',
  relationship: PARENT_RELATIONSHIP.Father,
}

/**
 * Talaba formasidagi ota-ona/vasiylar ro'yxati (`parents[]`).
 * Backend ro'yxatni to'liq almashtiradi, shuning uchun qator faqat formadan olib tashlanadi —
 * o'zgarish "Saqlash" bosilgandagina yuboriladi (bekor qilish bilan qaytariladi).
 */
export function StudentParentsFields({ control, register, errors }: StudentParentsFieldsProps) {
  const { t } = useTranslation()
  const { fields, append, remove } = useFieldArray({ control, name: 'parents' })

  return (
    <fieldset className="space-y-3 pt-3 border-t border-divider">
      <legend className="text-xs font-semibold text-heading">{t.students.form.parentsTitle}</legend>
      <p className="text-2xs text-caption">{t.students.form.parentsHint}</p>

      {fields.map((field, index) => {
        const rowErrors = errors.parents?.[index]
        const idPrefix = `student-parent-${index}`
        return (
          <div key={field.id} className="grid grid-cols-[1fr_1fr_8rem_auto] items-start gap-2">
            <FormField label={t.students.form.parentFullName} htmlFor={`${idPrefix}-name`} required>
              <Input
                id={`${idPrefix}-name`}
                error={rowErrors?.fullName?.message}
                {...register(`parents.${index}.fullName`)}
              />
            </FormField>
            <FormField label={t.students.form.parentPhone} htmlFor={`${idPrefix}-phone`} required>
              <Input
                id={`${idPrefix}-phone`}
                type="tel"
                error={rowErrors?.phone?.message}
                {...register(`parents.${index}.phone`)}
              />
            </FormField>
            <FormField
              label={t.students.form.parentRelationship}
              htmlFor={`${idPrefix}-relationship`}
              error={rowErrors?.relationship?.message}
            >
              <SelectInput
                id={`${idPrefix}-relationship`}
                {...register(`parents.${index}.relationship`, { valueAsNumber: true })}
              >
                {PARENT_RELATIONSHIP_VALUES.map((relationship) => (
                  <option key={relationship} value={relationship}>
                    {t.students.relationships[relationship]}
                  </option>
                ))}
              </SelectInput>
            </FormField>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-5"
              aria-label={t.students.form.removeParent}
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        )
      })}

      <Button type="button" variant="secondary" size="sm" onClick={() => append(EMPTY_PARENT)}>
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{t.students.form.addParent}</span>
      </Button>
    </fieldset>
  )
}
