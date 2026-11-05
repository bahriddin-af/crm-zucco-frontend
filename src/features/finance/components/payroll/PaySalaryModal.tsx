import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { useCashAccounts, useExpenseCategories } from '../../hooks/useFinance'
import { usePaySalary } from '../../hooks/usePayroll'
import { createPaySalarySchema, type PaySalaryFormValues } from '../../schemas/payrollSchemas'
import type { SalaryCalculationResponse } from '../../types/payrollTypes'
import { getDefaultAccountId } from '../../utils/cashAccounts'
import { CashAccountOptions } from '../form/CashAccountOptions'

interface PaySalaryModalProps {
  calculation: SalaryCalculationResponse
  onClose: () => void
}

/**
 * Tasdiqlangan maoshni kassadan to'lash. Summa hisobning `finalAmount` qiymati (backend shuni talab qiladi);
 * idempotentlik backendda hisob ID orqali ta'minlanadi, shuning uchun alohida `operationId` yo'q.
 */
export function PaySalaryModal({ calculation, onClose }: PaySalaryModalProps) {
  const { t } = useTranslation()
  const messages = t.payroll.calculations
  const schema = useMemo(() => createPaySalarySchema(t), [t])
  const { data: accounts = [], isLoading: isLoadingAccounts } = useCashAccounts()
  const { data: categories = [] } = useExpenseCategories()
  const paySalary = usePaySalary()
  const [pending, setPending] = useState<PaySalaryFormValues | null>(null)

  const { register, handleSubmit, formState, getValues, setValue } = useForm<PaySalaryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { cashAccountId: '', expenseCategoryId: '' },
  })

  useEffect(() => {
    if (accounts.length > 0 && !getValues('cashAccountId')) {
      setValue('cashAccountId', getDefaultAccountId(accounts))
    }
  }, [accounts, getValues, setValue])

  const handleConfirm = () => {
    if (!pending) return
    paySalary.mutate(
      {
        salaryCalculationId: calculation.id,
        cashAccountId: pending.cashAccountId,
        amount: calculation.finalAmount,
        expenseCategoryId: pending.expenseCategoryId || null,
      },
      { onSuccess: onClose, onSettled: () => setPending(null) }
    )
  }

  const amount = formatCurrency(calculation.finalAmount)
  const accountName = accounts.find((account) => account.id === pending?.cashAccountId)?.name ?? ''

  return (
    <>
      <Modal
        isOpen
        onClose={onClose}
        title={messages.payTitle}
        description={messages.payDescription}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button type="submit" form="pay-salary-form" variant="primary" size="sm" isLoading={paySalary.isPending}>
              {messages.pay}
            </Button>
          </>
        }
      >
        <form id="pay-salary-form" noValidate onSubmit={handleSubmit(setPending)} className="space-y-4">
          <div className="rounded-md bg-canvas border border-border p-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-heading">{calculation.teacherName}</div>
              <div className="text-2xs text-caption">{messages.payAmount}</div>
            </div>
            <span className="text-base font-bold text-heading tabular-nums">{amount}</span>
          </div>
          <FormField label={messages.cashAccount} htmlFor="pay-account" required error={formState.errors.cashAccountId?.message}>
            <SelectInput id="pay-account" disabled={isLoadingAccounts} {...register('cashAccountId')}>
              <CashAccountOptions accounts={accounts} placeholder={messages.cashAccountPlaceholder} />
            </SelectInput>
          </FormField>
          <FormField label={messages.expenseCategory} htmlFor="pay-category">
            <SelectInput id="pay-category" {...register('expenseCategoryId')}>
              <option value="">{messages.expenseCategoryDefault}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </SelectInput>
          </FormField>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={pending !== null}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        variant="primary"
        title={messages.payConfirmTitle}
        description={interpolate(messages.payConfirmDescription, {
          teacher: calculation.teacherName,
          amount,
          account: accountName,
        })}
        isLoading={paySalary.isPending}
      />
    </>
  )
}
