import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { CheckboxField } from '@/components/forms/CheckboxField'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { useTranslation } from '@/i18n'
import { useBranchOptions } from '@/features/branches/hooks/useBranches'
import { useSaveCashAccount } from '../../hooks/useFinance'
import { CASH_ACCOUNT_TYPE_VALUES, type CashAccount } from '../../types/financeTypes'
import {
  createCashAccountSchema,
  toCashAccountFormValues,
  toCashAccountRequest,
  type CashAccountFormValues,
} from '../../schemas/financeSchemas'

interface CashAccountModalProps {
  account: CashAccount | null
  onClose: () => void
}

/** Kassa hisobini yaratish/tahrirlash (upsert). Har ochilishda yangidan mount qilinadi. */
export function CashAccountModal({ account, onClose }: CashAccountModalProps) {
  const { t } = useTranslation()
  const text = t.finance.accountForm
  const schema = useMemo(() => createCashAccountSchema(t), [t])
  const { data: branches = [] } = useBranchOptions()
  const saveMutation = useSaveCashAccount(onClose)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CashAccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toCashAccountFormValues(account),
  })

  const onSubmit = handleSubmit((values) => saveMutation.mutate(toCashAccountRequest(values, account?.id ?? null)))

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={account ? text.editTitle : text.createTitle}
      description={text.description}
      maxWidth="sm"
    >
      <form onSubmit={onSubmit} noValidate className="space-y-3">
        <FormField label={text.name} htmlFor="cash-account-name" required>
          <Input
            id="cash-account-name"
            autoFocus
            placeholder={text.namePlaceholder}
            {...register('name')}
            error={errors.name?.message}
          />
        </FormField>
        <FormField label={text.type} htmlFor="cash-account-type" required error={errors.type?.message}>
          <SelectInput id="cash-account-type" {...register('type', { valueAsNumber: true })}>
            {CASH_ACCOUNT_TYPE_VALUES.map((type) => (
              <option key={type} value={type}>
                {t.finance.cashAccountTypes[type]}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <FormField label={text.branch} htmlFor="cash-account-branch">
          <SelectInput id="cash-account-branch" {...register('branchId')}>
            <option value="">{text.allBranches}</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <CheckboxField id="cash-account-default" label={text.isDefault} {...register('isDefault')} />
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={saveMutation.isPending}>
            {t.common.save}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
