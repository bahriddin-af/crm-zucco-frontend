import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { interpolate, useTranslation } from '@/i18n'
import { formatPhone } from '@/utils/formatters'
import { useGroupsList } from '@/features/groups/hooks/useGroups'
import { GROUP_STATUS } from '@/features/groups/types/groupTypes'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { todayIsoDate } from '@/utils/dateUtils'
import { useConvertLead } from '../hooks/useLeads'
import { createConvertLeadSchema, type ConvertLeadFormValues } from '../schemas/leadSchemas'
import type { LeadListItem } from '../types/leadTypes'

interface LeadConvertModalProps {
  lead: LeadListItem
  onClose: () => void
}

const FORM_ID = 'lead-convert-form'

export function LeadConvertModal({ lead, onClose }: LeadConvertModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createConvertLeadSchema(t), [t])
  const convertMutation = useConvertLead()
  const { data: groupsData } = useGroupsList()
  const groups = (groupsData?.items ?? []).filter((group) => group.status !== GROUP_STATUS.Completed)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConvertLeadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { groupId: '', joinedDate: todayIsoDate() },
  })

  const onSubmit = (values: ConvertLeadFormValues) => {
    convertMutation.mutate(
      {
        leadId: lead.id,
        groupId: values.groupId || null,
        joinedDate: values.groupId ? values.joinedDate : null,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t.leads.convert.title}
      description={interpolate(t.leads.convert.description, { name: lead.fullName })}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} variant="primary" isLoading={convertMutation.isPending}>
            {t.leads.convert.submit}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="p-3 bg-canvas rounded-lg border border-border text-xs space-y-1">
          <p className="font-semibold text-heading">{lead.fullName}</p>
          <p className="text-caption tabular-nums">{formatPhone(lead.phone)}</p>
          {lead.courseName && (
            <p className="text-primary font-medium">
              {interpolate(t.leads.convert.interestedCourse, { course: lead.courseName })}
            </p>
          )}
          <p className="text-2xs text-caption">{t.leads.convert.existingNote}</p>
        </div>

        <FormField label={t.leads.convert.group} htmlFor="convert-group">
          <SelectInput id="convert-group" {...register('groupId')}>
            <option value="">{t.leads.convert.noGroup}</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} — {group.courseName} ({group.teacherName})
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label={t.leads.convert.joinedDate} htmlFor="convert-joined-date">
          <Input
            id="convert-joined-date"
            type="date"
            error={errors.joinedDate?.message}
            {...register('joinedDate')}
          />
        </FormField>
      </form>
    </Modal>
  )
}
