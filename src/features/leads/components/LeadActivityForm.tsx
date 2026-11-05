import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { SelectInput } from '@/components/forms/SelectInput'
import { useAddLeadActivity } from '../hooks/useLeads'
import { createLeadActivitySchema, type LeadActivityFormValues } from '../schemas/leadSchemas'
import { LEAD_ACTIVITY_TYPE, MANUAL_ACTIVITY_TYPES } from '../types/leadTypes'

const DEFAULT_VALUES: LeadActivityFormValues = { activityType: LEAD_ACTIVITY_TYPE.Call, note: '' }

export function LeadActivityForm({ leadId }: { leadId: string }) {
  const { t } = useTranslation()
  const schema = useMemo(() => createLeadActivitySchema(t), [t])
  const addActivity = useAddLeadActivity()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadActivityFormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  const onSubmit = (values: LeadActivityFormValues) => {
    const activityType = MANUAL_ACTIVITY_TYPES.find((type) => type === values.activityType)
    if (activityType === undefined) return
    addActivity.mutate(
      { leadId, activityType, note: values.note },
      { onSuccess: () => reset(DEFAULT_VALUES) }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2 sm:items-start" noValidate>
      <SelectInput
        aria-label={t.leads.activityForm.type}
        className="sm:w-36"
        {...register('activityType', { valueAsNumber: true })}
      >
        {MANUAL_ACTIVITY_TYPES.map((type) => (
          <option key={type} value={type}>
            {t.leads.activityTypes[type]}
          </option>
        ))}
      </SelectInput>
      <Input
        aria-label={t.leads.activityForm.note}
        placeholder={t.leads.activityForm.notePlaceholder}
        error={errors.note?.message}
        {...register('note')}
      />
      <Button type="submit" variant="primary" isLoading={addActivity.isPending}>
        {t.leads.activityForm.submit}
      </Button>
    </form>
  )
}
