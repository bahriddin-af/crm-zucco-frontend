import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { useAuthStore } from '@/stores/authStore'
import { useCoursesList } from '@/features/courses/hooks/useCourses'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { emptyToNull, normalizePhone } from '@/utils/formUtils'
import { useLeadSources, useLeadStages, useSaveLead } from '../hooks/useLeads'
import { createLeadSchema, type LeadFormValues } from '../schemas/leadSchemas'
import type { LeadResponse } from '../types/leadTypes'

interface LeadModalProps {
  onClose: () => void
  defaultStageId?: string
  /** Berilsa — tahrirlash rejimi (bosqich backend `Update` da o'zgarmaydi, shuning uchun yashiriladi). */
  lead?: LeadResponse
}

const FORM_ID = 'lead-form'

export function LeadModal({ onClose, defaultStageId, lead }: LeadModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createLeadSchema(t), [t])
  const activeBranchId = useAuthStore((state) => state.activeBranchId)
  const { data: stages = [] } = useLeadStages()
  const { data: sources = [] } = useLeadSources()
  const { data: coursesData } = useCoursesList()
  const saveMutation = useSaveLead()
  const isEditing = Boolean(lead)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: lead?.fullName ?? '',
      phone: lead?.phone ?? '',
      parentPhone: lead?.parentPhone ?? '',
      stageId: lead?.stageId ?? defaultStageId ?? stages[0]?.id ?? '',
      courseId: lead?.courseId ?? '',
      sourceId: lead?.sourceId ?? '',
      note: lead?.note ?? '',
    },
  })

  const onSubmit = (values: LeadFormValues) => {
    const parentPhone = emptyToNull(values.parentPhone)
    saveMutation.mutate(
      {
        id: lead?.id ?? null,
        fullName: values.fullName,
        phone: normalizePhone(values.phone),
        parentPhone: parentPhone ? normalizePhone(parentPhone) : null,
        stageId: values.stageId,
        branchId: lead ? (lead.branchId ?? null) : activeBranchId || null,
        courseId: emptyToNull(values.courseId),
        sourceId: emptyToNull(values.sourceId),
        assignedToUserId: lead?.assignedToUserId ?? null,
        note: emptyToNull(values.note),
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? t.leads.form.editTitle : t.leads.form.createTitle}
      description={t.leads.form.description}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} variant="primary" isLoading={saveMutation.isPending}>
            {t.leads.form.submit}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label={t.leads.form.fullName} htmlFor="lead-full-name" required>
          <Input
            id="lead-full-name"
            placeholder={t.leads.form.fullNamePlaceholder}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label={t.leads.form.phone} htmlFor="lead-phone" required>
            <Input id="lead-phone" type="tel" error={errors.phone?.message} {...register('phone')} />
          </FormField>
          <FormField label={t.leads.form.parentPhone} htmlFor="lead-parent-phone">
            <Input id="lead-parent-phone" type="tel" error={errors.parentPhone?.message} {...register('parentPhone')} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {!isEditing && (
            <FormField label={t.leads.form.stage} htmlFor="lead-stage" required error={errors.stageId?.message}>
              <SelectInput id="lead-stage" {...register('stageId')}>
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </SelectInput>
            </FormField>
          )}
          <FormField label={t.leads.form.course} htmlFor="lead-course">
            <SelectInput id="lead-course" {...register('courseId')}>
              <option value="">{t.leads.form.coursePlaceholder}</option>
              {(coursesData?.items ?? []).map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </SelectInput>
          </FormField>
          <FormField label={t.leads.form.source} htmlFor="lead-source">
            <SelectInput id="lead-source" {...register('sourceId')}>
              <option value="">{t.leads.form.sourcePlaceholder}</option>
              {sources
                .filter((source) => source.isActive || source.id === lead?.sourceId)
                .map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
            </SelectInput>
          </FormField>
        </div>

        <FormField label={t.leads.form.note} htmlFor="lead-note">
          <Input id="lead-note" placeholder={t.leads.form.notePlaceholder} {...register('note')} />
        </FormField>
      </form>
    </Modal>
  )
}
