import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { DEFAULT_GENERATED_LESSONS, MAX_GENERATED_LESSONS } from '../../types/groupTypes'
import { useGenerateSchedule } from '../../hooks/useGroupLessons'
import { createGenerateScheduleSchema, type GenerateScheduleFormValues } from '../../utils/lessonSchemas'

interface GenerateScheduleFormProps {
  groupId: string
}

export function GenerateScheduleForm({ groupId }: GenerateScheduleFormProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createGenerateScheduleSchema(t), [t])
  const generateMutation = useGenerateSchedule()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateScheduleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { totalLessons: DEFAULT_GENERATED_LESSONS, startFromDate: '' },
  })

  const onSubmit = handleSubmit((values) => {
    generateMutation.mutate({
      groupId,
      totalLessons: values.totalLessons,
      startFromDate: values.startFromDate === '' ? null : values.startFromDate,
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-lg border border-border bg-canvas p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold text-heading">{t.groups.generateTitle}</h3>
        <p className="text-2xs text-caption">{t.groups.generateHint}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start">
        <FormField label={t.groups.totalLessons} htmlFor="generate-total">
          <Input
            id="generate-total"
            type="number"
            min={1}
            max={MAX_GENERATED_LESSONS}
            {...register('totalLessons', { valueAsNumber: true })}
            error={errors.totalLessons?.message}
          />
        </FormField>
        <FormField label={t.groups.startFromDate} htmlFor="generate-start">
          <Input id="generate-start" type="date" {...register('startFromDate')} error={errors.startFromDate?.message} />
        </FormField>
        <Button type="submit" variant="primary" size="md" className="sm:mt-5" isLoading={generateMutation.isPending}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.groups.generate}</span>
        </Button>
      </div>
    </form>
  )
}
