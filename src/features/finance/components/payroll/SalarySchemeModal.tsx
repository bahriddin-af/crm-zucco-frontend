import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useTranslation } from '@/i18n'
import { useUpsertSalaryScheme } from '../../hooks/usePayroll'
import {
  createSalarySchemeSchema,
  toUpsertSalarySchemeRequest,
  type SalarySchemeFormValues,
} from '../../schemas/payrollSchemas'
import { SALARY_CALCULATION_TYPE, type SalarySchemeResponse } from '../../types/payrollTypes'
import { SalarySchemeFormFields } from './SalarySchemeFormFields'

interface SalarySchemeModalProps {
  /** `undefined` — yangi sxema, aks holda tahrirlanadigan sxema. */
  scheme?: SalarySchemeResponse
  defaultTeacherId: string
  onClose: () => void
}

function toFormValues(scheme: SalarySchemeResponse | undefined, teacherId: string): SalarySchemeFormValues {
  if (!scheme) {
    return {
      teacherId,
      groupId: '',
      calculationType: SALARY_CALCULATION_TYPE.PercentageOfRevenue,
      rateValue: 0,
      onlyPaidStudents: true,
      requireAttendanceMarked: true,
      isActive: true,
    }
  }
  return {
    teacherId: scheme.teacherId,
    groupId: scheme.groupId ?? '',
    calculationType: scheme.calculationType,
    rateValue: scheme.rateValue,
    onlyPaidStudents: scheme.onlyPaidStudents,
    requireAttendanceMarked: scheme.requireAttendanceMarked,
    isActive: scheme.isActive,
  }
}

/** Maosh sxemasini yaratish yoki yangilash (backend upsert). */
export function SalarySchemeModal({ scheme, defaultTeacherId, onClose }: SalarySchemeModalProps) {
  const { t } = useTranslation()
  const messages = t.payroll.schemes
  const schema = useMemo(() => createSalarySchemeSchema(t), [t])
  const upsert = useUpsertSalaryScheme()

  const form = useForm<SalarySchemeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(scheme, defaultTeacherId),
  })

  const onSubmit = (values: SalarySchemeFormValues) => {
    upsert.mutate(toUpsertSalarySchemeRequest(values, scheme?.id), { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={scheme ? messages.editTitle : messages.createTitle}
      description={messages.modalDescription}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form="salary-scheme-form" variant="primary" size="sm" isLoading={upsert.isPending}>
            {t.common.save}
          </Button>
        </>
      }
    >
      <form id="salary-scheme-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <SalarySchemeFormFields form={form} isEditing={scheme !== undefined} />
      </form>
    </Modal>
  )
}
