import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { BILLING_MODE_VALUES, GROUP_STATUS_VALUES } from '../../types/groupTypes'
import type { GroupFormValues } from '../../utils/groupFormSchema'

/** Narx, sig'im, holat va hisob-kitob turi. */
export function GroupBillingFields() {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useFormContext<GroupFormValues>()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <FormField label={t.groups.fields.monthlyPrice} htmlFor="group-price" required>
        <Input
          id="group-price"
          type="number"
          min={0}
          step="any"
          {...register('monthlyPrice', { valueAsNumber: true })}
          error={errors.monthlyPrice?.message}
        />
      </FormField>

      <FormField label={t.groups.fields.capacity} htmlFor="group-capacity" required>
        <Input
          id="group-capacity"
          type="number"
          min={1}
          step={1}
          {...register('capacity', { valueAsNumber: true })}
          error={errors.capacity?.message}
        />
      </FormField>

      <FormField label={t.groups.fields.status} htmlFor="group-status" error={errors.status?.message}>
        <SelectInput id="group-status" {...register('status', { valueAsNumber: true })}>
          {GROUP_STATUS_VALUES.map((value) => (
            <option key={value} value={value}>
              {t.groups.groupStatus[value]}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label={t.groups.fields.billingMode} htmlFor="group-billing" error={errors.billingMode?.message}>
        <SelectInput id="group-billing" {...register('billingMode', { valueAsNumber: true })}>
          {BILLING_MODE_VALUES.map((value) => (
            <option key={value} value={value}>
              {t.groups.billingMode[value]}
            </option>
          ))}
        </SelectInput>
      </FormField>
    </div>
  )
}
