import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { getApiErrorCode, OPERATION_CONFLICT_CODE } from '@/utils/apiError'
import { formatPhone } from '@/utils/formatters'
import { useConfirmedOperation } from '@/hooks/useConfirmedOperation'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { TextAreaInput } from '@/components/forms/TextAreaInput'
import { useSendSms } from '../hooks/useSms'
import { createSendSmsSchema, type SendSmsFormInput, type SendSmsFormValues } from '../types/smsSchemas'
import { SMS_ERROR_CODE, SMS_TRIGGER, type SmsTemplate } from '../types/smsTypes'
import { SmsSendResult, type SmsSendOutcome } from './SmsSendResult'
import { SmsTemplatePicker } from './SmsTemplatePicker'

const DEFAULT_VALUES: SendSmsFormInput = { recipientPhone: '', message: '', trigger: SMS_TRIGGER.CustomBroadcast }
const TRIGGERS = Object.values(SMS_TRIGGER)

/** Rad etilgan SMS yuborilmagan — yangi urinish xavfsiz. Holati noma'lum SMS uchun kalit saqlanadi (takror yuborilmaydi). */
const shouldRenewOperation = (error: unknown): boolean => {
  const code = getApiErrorCode(error)
  return code === OPERATION_CONFLICT_CODE || code === SMS_ERROR_CODE.ProviderRejected
}

const toOutcome = (error: unknown): SmsSendOutcome | null => {
  const code = getApiErrorCode(error)
  if (code === SMS_ERROR_CODE.SubmissionUnknown) return { kind: 'unknown' }
  if (code === SMS_ERROR_CODE.ProviderRejected) return { kind: 'rejected' }
  return null
}

export function SmsSendForm() {
  const { t } = useTranslation()
  const schema = useMemo(() => createSendSmsSchema(t), [t])
  const sendSms = useSendSms()
  const [outcome, setOutcome] = useState<SmsSendOutcome | null>(null)
  const { register, handleSubmit, setValue, control, reset, formState } = useForm<SendSmsFormInput, unknown, SendSmsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  })
  const { errors } = formState
  const messageLength = useWatch({ control, name: 'message' }).length

  const operation = useConfirmedOperation({
    submit: (values: SendSmsFormValues, operationId) => sendSms.mutateAsync({ ...values, operationId }),
    onSuccess: (log) => {
      setOutcome({ kind: 'accepted', phone: log.recipientPhone })
      reset(DEFAULT_VALUES)
    },
    onError: (error) => setOutcome(toOutcome(error)),
    shouldRenewOnError: shouldRenewOperation,
  })

  const applyTemplate = (template: SmsTemplate) => {
    setValue('message', template.templateText, { shouldValidate: true })
    setValue('trigger', template.trigger)
  }

  const startNew = () => {
    operation.renew()
    setOutcome(null)
    reset(DEFAULT_VALUES)
  }

  return (
    <>
      <form className="space-y-4" noValidate onSubmit={handleSubmit(operation.requestConfirm)}>
        <SmsTemplatePicker onSelect={applyTemplate} />
        <FormField label={t.sms.recipientPhone} htmlFor="sms-phone" error={errors.recipientPhone?.message}>
          <Input id="sms-phone" type="tel" placeholder={t.sms.phonePlaceholder} {...register('recipientPhone')} />
        </FormField>
        <FormField label={t.sms.trigger} htmlFor="sms-trigger" error={errors.trigger?.message}>
          <SelectInput id="sms-trigger" {...register('trigger', { valueAsNumber: true })}>
            {TRIGGERS.map((trigger) => (
              <option key={trigger} value={trigger}>
                {t.sms.triggers[trigger]}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <FormField
          label={t.sms.message}
          htmlFor="sms-message"
          error={errors.message?.message}
          hint={interpolate(t.sms.messageLength, { count: messageLength })}
        >
          <TextAreaInput id="sms-message" rows={5} hasError={Boolean(errors.message)} {...register('message')} />
        </FormField>
  
        <PermissionGuard permission={PERMISSIONS.NOTIFICATIONS.SEND_SMS}>
          <Button variant="primary" size="sm" type="submit" className="w-full" isLoading={operation.isSubmitting}>
            <Send className="w-3.5 h-3.5" />
            <span>{t.sms.send}</span>
          </Button>
        </PermissionGuard>
      </form>

      {outcome && <SmsSendResult outcome={outcome} onStartNew={startNew} />}

      <ConfirmDialog
        isOpen={operation.isConfirmOpen}
        variant="primary"
        isLoading={operation.isSubmitting}
        onClose={operation.cancel}
        onConfirm={() => void operation.confirm()}
        confirmLabel={t.sms.send}
        description={interpolate(t.sms.sendConfirm, {
          phone: formatPhone(operation.pendingValues?.recipientPhone.replace('+', '') ?? ''),
        })}
      />
    </>
  )
}
