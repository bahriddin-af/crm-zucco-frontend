import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'

const createTopicSchema = () => z.object({ topic: z.string() })
type TopicFormValues = z.infer<ReturnType<typeof createTopicSchema>>

interface LessonTopicFormProps {
  defaultTopic?: string | null
  disabled: boolean
  isSaving: boolean
  onSaveAll: (topic: string | null) => void
}

/** Mavzu + "Barchasini saqlash": barcha talabalarni (belgilanmaganlarini "Keldi" deb) bitta so'rovda yuboradi. */
export function LessonTopicForm({ defaultTopic, disabled, isSaving, onSaveAll }: LessonTopicFormProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createTopicSchema(), [])
  const { register, handleSubmit } = useForm<TopicFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic: defaultTopic ?? '' },
  })

  const onSubmit = handleSubmit((values) => {
    const topic = values.topic.trim()
    onSaveAll(topic === '' ? null : topic)
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col sm:flex-row sm:items-end gap-2">
      <FormField label={t.attendance.topic} htmlFor="lesson-topic" className="flex-1">
        <Input id="lesson-topic" placeholder={t.attendance.topicPlaceholder} disabled={disabled} {...register('topic')} />
      </FormField>
      <Button type="submit" variant="primary" disabled={disabled} isLoading={isSaving} title={t.attendance.topicHint}>
        <Save className="w-3.5 h-3.5" />
        <span>{t.attendance.saveAll}</span>
      </Button>
    </form>
  )
}
