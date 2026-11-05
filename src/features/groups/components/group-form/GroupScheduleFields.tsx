import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { DAY_SCHEDULE_TYPE, DAY_SCHEDULE_VALUES } from '../../types/groupTypes'
import type { GroupFormValues } from '../../utils/groupFormSchema'
import { WeekdayPicker } from './WeekdayPicker'

/** Dars kunlari (maxsus kunlar bilan), sana oralig'i va vaqt oralig'i. */
export function GroupScheduleFields() {
  const { t } = useTranslation()
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<GroupFormValues>()
  const daysSchedule = useWatch({ control, name: 'daysSchedule' })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <FormField
        label={t.groups.fields.daysSchedule}
        htmlFor="group-days"
        required
        error={errors.daysSchedule?.message}
        className="sm:col-span-2"
      >
        <SelectInput id="group-days" {...register('daysSchedule', { valueAsNumber: true })}>
          {DAY_SCHEDULE_VALUES.map((value) => (
            <option key={value} value={value}>
              {t.groups.daySchedule[value]}
            </option>
          ))}
        </SelectInput>
      </FormField>

      {daysSchedule === DAY_SCHEDULE_TYPE.Custom && (
        <FormField
          label={t.groups.fields.customDays}
          required
          error={errors.customDays?.message}
          className="sm:col-span-2"
        >
          <Controller
            control={control}
            name="customDays"
            render={({ field }) => <WeekdayPicker value={field.value} onChange={field.onChange} />}
          />
        </FormField>
      )}

      <FormField label={t.groups.fields.startDate} htmlFor="group-start-date" required>
        <Input id="group-start-date" type="date" {...register('startDate')} error={errors.startDate?.message} />
      </FormField>

      <FormField label={t.groups.fields.endDate} htmlFor="group-end-date">
        <Input id="group-end-date" type="date" {...register('endDate')} error={errors.endDate?.message} />
      </FormField>

      <FormField label={t.groups.fields.startTime} htmlFor="group-start-time" required>
        <Input id="group-start-time" type="time" {...register('startTime')} error={errors.startTime?.message} />
      </FormField>

      <FormField label={t.groups.fields.endTime} htmlFor="group-end-time" required>
        <Input id="group-end-time" type="time" {...register('endTime')} error={errors.endTime?.message} />
      </FormField>
    </div>
  )
}
