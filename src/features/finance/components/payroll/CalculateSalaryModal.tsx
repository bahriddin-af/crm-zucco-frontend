import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { useCalculateSalary } from '../../hooks/usePayroll'
import {
  createCalculateSalarySchema,
  toCalculateSalaryRequest,
  type CalculateSalaryFormValues,
} from '../../schemas/payrollSchemas'
import { TeacherOptions } from './TeacherOptions'

interface CalculateSalaryModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTeacherId: string
  defaultPeriod: string
}

export function CalculateSalaryModal({ isOpen, ...props }: CalculateSalaryModalProps) {
  if (!isOpen) return null
  return <CalculateSalaryForm {...props} />
}

function CalculateSalaryForm({ onClose, defaultTeacherId, defaultPeriod }: Omit<CalculateSalaryModalProps, 'isOpen'>) {
  const { t } = useTranslation()
  const messages = t.payroll.calculations
  const schema = useMemo(() => createCalculateSalarySchema(t), [t])
  const calculate = useCalculateSalary()

  const { register, handleSubmit, formState } = useForm<CalculateSalaryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { teacherId: defaultTeacherId, period: defaultPeriod, bonus: 0, deduction: 0 },
  })
  const { errors } = formState

  const onSubmit = (values: CalculateSalaryFormValues) => {
    calculate.mutate(toCalculateSalaryRequest(values), { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={messages.modalTitle}
      description={messages.modalDescription}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" form="calculate-salary-form" variant="primary" size="sm" isLoading={calculate.isPending}>
            {messages.calculate}
          </Button>
        </>
      }
    >
      <form id="calculate-salary-form" noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label={t.payroll.teacher} htmlFor="calc-teacher" required error={errors.teacherId?.message}>
          <SelectInput id="calc-teacher" hasError={Boolean(errors.teacherId)} {...register('teacherId')}>
            <TeacherOptions placeholder={t.payroll.teacherPlaceholder} />
          </SelectInput>
        </FormField>
        <FormField label={t.payroll.period} htmlFor="calc-period" required>
          <Input id="calc-period" type="month" error={errors.period?.message} {...register('period')} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label={messages.bonus} htmlFor="calc-bonus">
            <Input
              id="calc-bonus"
              type="number"
              inputMode="decimal"
              step="any"
              error={errors.bonus?.message}
              {...register('bonus', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label={messages.deduction} htmlFor="calc-deduction">
            <Input
              id="calc-deduction"
              type="number"
              inputMode="decimal"
              step="any"
              error={errors.deduction?.message}
              {...register('deduction', { valueAsNumber: true })}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  )
}
