import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { interpolate, useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { emptyToNull } from '@/utils/formUtils'
import { useMarkLeadLost } from '../hooks/useLeads'
import { createLostLeadSchema, type LostLeadFormValues } from '../schemas/leadSchemas'
import { LOST_REASON, SELECTABLE_LOST_REASONS, type LeadListItem } from '../types/leadTypes'

interface LeadLostModalProps {
  lead: LeadListItem
  onClose: () => void
}

const FORM_ID = 'lead-lost-form'

export function LeadLostModal({ lead, onClose }: LeadLostModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createLostLeadSchema(t), [t])
  const lostMutation = useMarkLeadLost()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LostLeadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reason: LOST_REASON.TooExpensive, details: '' },
  })

  const onSubmit = (values: LostLeadFormValues) => {
    const reason = SELECTABLE_LOST_REASONS.find((item) => item === values.reason)
    if (reason === undefined) return
    lostMutation.mutate(
      { leadId: lead.id, reason, details: emptyToNull(values.details) },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t.leads.lost.title}
      description={interpolate(t.leads.lost.description, { name: lead.fullName })}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} variant="danger" isLoading={lostMutation.isPending}>
            {t.leads.lost.submit}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label={t.leads.lost.reason} htmlFor="lost-reason" required error={errors.reason?.message}>
          <SelectInput id="lost-reason" {...register('reason', { valueAsNumber: true })}>
            {SELECTABLE_LOST_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {t.leads.lostReasons[reason]}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label={t.leads.lost.details} htmlFor="lost-details">
          <Input id="lost-details" placeholder={t.leads.lost.detailsPlaceholder} {...register('details')} />
        </FormField>
      </form>
    </Modal>
  )
}
