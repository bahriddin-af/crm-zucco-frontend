import { useWatch, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import { CheckboxField } from '@/components/forms/CheckboxField'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import type { SalarySchemeFormValues } from '../../schemas/payrollSchemas'
import { SALARY_CALCULATION_TYPE, SALARY_CALCULATION_TYPES } from '../../types/payrollTypes'
import { TeacherOptions } from './TeacherOptions'

interface SalarySchemeFormFieldsProps {
  form: UseFormReturn<SalarySchemeFormValues>
  /** Tahrirlashda o'qituvchi va guruh o'zgarmaydi (backend talabi). */
  isEditing: boolean
}

export function SalarySchemeFormFields({ form, isEditing }: SalarySchemeFormFieldsProps) {
  const { t } = useTranslation()
  const messages = t.payroll.schemes
  const { register, control, setValue, formState } = form
  const { errors } = formState
  const [teacherId, calculationType] = useWatch({ control, name: ['teacherId', 'calculationType'] })
  const isPercentage = calculationType === SALARY_CALCULATION_TYPE.PercentageOfRevenue
  const { data: groupsData } = useGroupsList(teacherId ? { teacherId } : undefined)
  const groups = teacherId ? (groupsData?.items ?? []) : []

  return (
    <div className="space-y-4">
      <FormField label={t.payroll.teacher} htmlFor="scheme-teacher" required error={errors.teacherId?.message}>
        <SelectInput
          id="scheme-teacher"
          disabled={isEditing}
          hasError={Boolean(errors.teacherId)}
          {...register('teacherId', { onChange: () => setValue('groupId', '') })}
        >
          <TeacherOptions placeholder={t.payroll.teacherPlaceholder} />
        </SelectInput>
      </FormField>

      <FormField label={messages.group} htmlFor="scheme-group">
        <SelectInput id="scheme-group" disabled={isEditing || !teacherId} {...register('groupId')}>
          <option value="">{messages.allGroups}</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField
          label={messages.calculationType}
          htmlFor="scheme-type"
          required
          error={errors.calculationType?.message}
        >
          <SelectInput id="scheme-type" {...register('calculationType', { valueAsNumber: true })}>
            {SALARY_CALCULATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.payroll.calculationTypes[type]}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <FormField
          label={messages.rateValue}
          htmlFor="scheme-rate"
          required
          hint={isPercentage ? messages.ratePercentHint : messages.rateAmountHint}
        >
          <Input
            id="scheme-rate"
            type="number"
            inputMode="decimal"
            step="any"
            error={errors.rateValue?.message}
            {...register('rateValue', { valueAsNumber: true })}
          />
        </FormField>
      </div>

      <div className="space-y-2">
        <CheckboxField id="scheme-only-paid" label={messages.onlyPaidStudents} {...register('onlyPaidStudents')} />
        <CheckboxField
          id="scheme-attendance"
          label={messages.requireAttendanceMarked}
          {...register('requireAttendanceMarked')}
        />
        <CheckboxField id="scheme-active" label={messages.isActive} {...register('isActive')} />
      </div>
    </div>
  )
}
