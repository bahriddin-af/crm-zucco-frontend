import type { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { TextAreaInput } from '@/components/forms/TextAreaInput'
import type { ExpenseFormValues } from '../../schemas/financeSchemas'
import type { CashAccount, ExpenseCategory } from '../../types/financeTypes'
import { CashAccountOptions } from '../form/CashAccountOptions'

interface ExpenseFormFieldsProps {
  form: UseFormReturn<ExpenseFormValues>
  accounts: CashAccount[]
  isLoadingAccounts: boolean
  categories: ExpenseCategory[]
  isLoadingCategories: boolean
}

export function ExpenseFormFields({
  form,
  accounts,
  isLoadingAccounts,
  categories,
  isLoadingCategories,
}: ExpenseFormFieldsProps) {
  const { t } = useTranslation()
  const { register, formState } = form
  const { errors } = formState
  const messages = t.expenses.modal
  const hasNoCategories = !isLoadingCategories && categories.length === 0

  return (
    <div className="space-y-4">
      <FormField
        label={messages.category}
        htmlFor="expense-category"
        required
        error={errors.expenseCategoryId?.message}
        hint={hasNoCategories ? messages.noCategories : undefined}
      >
        <SelectInput
          id="expense-category"
          disabled={isLoadingCategories || hasNoCategories}
          hasError={Boolean(errors.expenseCategoryId)}
          {...register('expenseCategoryId')}
        >
          <option value="">{messages.categoryPlaceholder}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label={messages.cashAccount} htmlFor="expense-account" required error={errors.cashAccountId?.message}>
        <SelectInput
          id="expense-account"
          disabled={isLoadingAccounts}
          hasError={Boolean(errors.cashAccountId)}
          {...register('cashAccountId')}
        >
          <CashAccountOptions accounts={accounts} placeholder={messages.cashAccountPlaceholder} />
        </SelectInput>
      </FormField>

      <FormField label={messages.amount} htmlFor="expense-amount" required>
        <Input
          id="expense-amount"
          type="number"
          inputMode="decimal"
          step="any"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />
      </FormField>

      <FormField label={messages.recipient} htmlFor="expense-recipient">
        <Input
          id="expense-recipient"
          placeholder={messages.recipientPlaceholder}
          error={errors.recipient?.message}
          {...register('recipient')}
        />
      </FormField>

      <FormField
        label={messages.descriptionLabel}
        htmlFor="expense-description"
        required
        error={errors.description?.message}
      >
        <TextAreaInput
          id="expense-description"
          rows={3}
          placeholder={messages.descriptionPlaceholder}
          hasError={Boolean(errors.description)}
          {...register('description')}
        />
      </FormField>
    </div>
  )
}
