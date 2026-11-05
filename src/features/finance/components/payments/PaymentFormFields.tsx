import { useWatch, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import type { EnrolledGroupInfo } from '@/features/students/types/studentTypes'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import type { PaymentFormValues } from '../../schemas/financeSchemas'
import type { CashAccount } from '../../types/financeTypes'
import { CashAccountOptions } from '../form/CashAccountOptions'
import { PaymentMethodPicker } from './PaymentMethodPicker'
import { PaymentStudentField } from './PaymentStudentField'

interface PaymentFormFieldsProps {
  form: UseFormReturn<PaymentFormValues>
  accounts: CashAccount[]
  isLoadingAccounts: boolean
  groups: EnrolledGroupInfo[]
  selectedStudent?: { id: string; fullName: string }
}

export function PaymentFormFields({
  form,
  accounts,
  isLoadingAccounts,
  groups,
  selectedStudent,
}: PaymentFormFieldsProps) {
  const { t } = useTranslation()
  const { register, control, setValue, formState } = form
  const paymentMethod = useWatch({ control, name: 'paymentMethod' })
  const { errors } = formState
  const messages = t.finance.drawer

  return (
    <div className="space-y-4">
      <PaymentStudentField
        registration={register('studentId', { onChange: () => setValue('groupId', '') })}
        error={errors.studentId?.message}
        selectedStudent={selectedStudent}
      />

      <FormField label={messages.cashAccount} htmlFor="payment-account" required error={errors.cashAccountId?.message}>
        <SelectInput
          id="payment-account"
          disabled={isLoadingAccounts}
          hasError={Boolean(errors.cashAccountId)}
          {...register('cashAccountId')}
        >
          <CashAccountOptions accounts={accounts} placeholder={messages.cashAccountPlaceholder} />
        </SelectInput>
      </FormField>

      <PaymentMethodPicker
        value={paymentMethod}
        onChange={(method) => setValue('paymentMethod', method, { shouldValidate: true })}
        error={errors.paymentMethod?.message}
      />

      <FormField label={messages.amount} htmlFor="payment-amount" required>
        <Input
          id="payment-amount"
          type="number"
          inputMode="decimal"
          step="any"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label={messages.group} htmlFor="payment-group" error={errors.groupId?.message}>
          <SelectInput id="payment-group" disabled={groups.length === 0} {...register('groupId')}>
            <option value="">{messages.groupNone}</option>
            {groups.map((group) => (
              <option key={group.groupId} value={group.groupId}>
                {group.groupName}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label={messages.billingPeriod} htmlFor="payment-period">
          <Input
            id="payment-period"
            type="month"
            error={errors.billingPeriod?.message}
            {...register('billingPeriod')}
          />
        </FormField>
      </div>

      <FormField label={messages.comment} htmlFor="payment-comment">
        <Input
          id="payment-comment"
          placeholder={messages.commentPlaceholder}
          error={errors.comment?.message}
          {...register('comment')}
        />
      </FormField>
    </div>
  )
}
