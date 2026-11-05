import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { useCashAccounts, useExpenseCategories, useRecordExpense } from '../hooks/useFinance'
import { useConfirmedOperation } from '@/hooks/useConfirmedOperation'
import {
  createExpenseSchema,
  toRecordExpenseRequest,
  type ExpenseFormValues,
} from '../schemas/financeSchemas'
import { getDefaultAccountId } from '../utils/cashAccounts'
import { ExpenseFormFields } from './expenses/ExpenseFormFields'

interface ExpenseModalProps {
  isOpen: boolean
  onClose: () => void
}

/** Xarajatni qayd etish. Har ochilishda yangi forma va yangi `operationId`. */
export function ExpenseModal({ isOpen, onClose }: ExpenseModalProps) {
  if (!isOpen) return null
  return <ExpenseModalContent onClose={onClose} />
}

function ExpenseModalContent({ onClose }: Pick<ExpenseModalProps, 'onClose'>) {
  const { t } = useTranslation()
  const schema = useMemo(() => createExpenseSchema(t), [t])
  const accountsQuery = useCashAccounts()
  const categoriesQuery = useExpenseCategories()
  const recordExpense = useRecordExpense()
  const operation = useConfirmedOperation({
    submit: (values: ExpenseFormValues, operationId) => recordExpense.mutateAsync(toRecordExpenseRequest(values, operationId)),
    onSuccess: () => onClose(),
  })
  const accounts = useMemo(() => accountsQuery.data ?? [], [accountsQuery.data])

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { expenseCategoryId: '', cashAccountId: '', description: '', recipient: '' },
  })
  const { getValues, setValue } = form

  useEffect(() => {
    if (accounts.length > 0 && !getValues('cashAccountId')) {
      setValue('cashAccountId', getDefaultAccountId(accounts))
    }
  }, [accounts, getValues, setValue])


  const pending = operation.pendingValues
  const pendingAccount = accounts.find((account) => account.id === pending?.cashAccountId)

  return (
    <>
      <Modal
        isOpen
        onClose={onClose}
        title={t.expenses.modal.title}
        description={t.expenses.modal.description}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              form="expense-form"
              variant="danger"
              size="sm"
              isLoading={recordExpense.isPending}
            >
              {t.expenses.modal.submit}
            </Button>
          </>
        }
      >
        <form id="expense-form" noValidate onSubmit={form.handleSubmit(operation.requestConfirm)}>
          <ExpenseFormFields
            form={form}
            accounts={accounts}
            isLoadingAccounts={accountsQuery.isLoading}
            categories={categoriesQuery.data ?? []}
            isLoadingCategories={categoriesQuery.isLoading}
          />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={operation.isConfirmOpen}
        onClose={operation.cancel}
        onConfirm={() => void operation.confirm()}
        variant="primary"
        title={t.expenses.modal.confirmTitle}
        description={interpolate(t.expenses.modal.confirmDescription, {
          amount: formatCurrency(pending?.amount ?? 0),
          account: pendingAccount?.name ?? '',
        })}
        isLoading={recordExpense.isPending}
      />
    </>
  )
}
