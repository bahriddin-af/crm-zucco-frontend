import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { CheckboxField } from '@/components/forms/CheckboxField'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { TextAreaInput } from '@/components/forms/TextAreaInput'
import { useUpsertSmsTemplate } from '../hooks/useSms'
import { createSmsTemplateSchema, type SmsTemplateFormValues } from '../types/smsSchemas'
import { SMS_TRIGGER, type SmsTemplate } from '../types/smsTypes'

const FORM_ID = 'sms-template-form'
const TRIGGERS = Object.values(SMS_TRIGGER)

interface SmsTemplateFormModalProps {
  /** `null` — yangi shablon. */
  template: SmsTemplate | null
  onClose: () => void
}

export function SmsTemplateFormModal({ template, onClose }: SmsTemplateFormModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createSmsTemplateSchema(t), [t])
  const upsert = useUpsertSmsTemplate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SmsTemplateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: template?.title ?? '',
      trigger: template?.trigger ?? SMS_TRIGGER.CustomBroadcast,
      templateText: template?.templateText ?? '',
      isActive: template?.isActive ?? true,
    },
  })

  const onSubmit = (values: SmsTemplateFormValues) => {
    upsert.mutate(
      { id: template?.id ?? null, ...values },
      {
        onSuccess: () => {
          toast.success(t.sms.templateSaved)
          onClose()
        },
      }
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={template ? t.sms.editTemplate : t.sms.newTemplate}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button variant="primary" size="sm" type="submit" form={FORM_ID} isLoading={upsert.isPending}>
            {t.common.save}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} className="space-y-3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <FormField label={t.sms.templateTitle} htmlFor="template-title" error={errors.title?.message}>
          <Input id="template-title" {...register('title')} />
        </FormField>
        <FormField label={t.sms.trigger} htmlFor="template-trigger" error={errors.trigger?.message}>
          <SelectInput id="template-trigger" {...register('trigger', { valueAsNumber: true })}>
            {TRIGGERS.map((trigger) => (
              <option key={trigger} value={trigger}>
                {t.sms.triggers[trigger]}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <FormField label={t.sms.templateText} htmlFor="template-text" error={errors.templateText?.message}>
          <TextAreaInput
            id="template-text"
            rows={5}
            hasError={Boolean(errors.templateText)}
            {...register('templateText')}
          />
        </FormField>
        <CheckboxField id="template-active" label={t.sms.templateActive} {...register('isActive')} />
      </form>
    </Modal>
  )
}
