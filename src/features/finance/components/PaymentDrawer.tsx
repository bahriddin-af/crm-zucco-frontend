import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { useStudentDetail } from '@/features/students/hooks/useStudents'
import { useCashAccounts, useRecordPayment } from '../hooks/useFinance'
import { useConfirmedOperation } from '@/hooks/useConfirmedOperation'
import { toMonthPeriod } from '@/utils/dateUtils'
import {
  createPaymentSchema,
  toRecordPaymentRequest,
  type PaymentFormValues,
} from '../schemas/financeSchemas'
import { PAYMENT_METHOD } from '../types/financeTypes'
import { getDefaultAccountId } from '../utils/cashAccounts'
import { PaymentFormFields } from './payments/PaymentFormFields'

interface PaymentDrawerProps {
  isOpen: boolean
  onClose: () => void
  preselectedStudentId?: string
}

/** To'lov qabul qilish paneli. Har ochilishda yangi forma va yangi `operationId` yaratiladi. */
export function PaymentDrawer({ isOpen, onClose, preselectedStudentId }: PaymentDrawerProps) {
  if (!isOpen) return null
  return <PaymentDrawerContent onClose={onClose} preselectedStudentId={preselectedStudentId} />
}

function PaymentDrawerContent({ onClose, preselectedStudentId }: Omit<PaymentDrawerProps, 'isOpen'>) {
  const { t } = useTranslation()
  const schema = useMemo(() => createPaymentSchema(t), [t])
  const { data: accounts = [], isLoading: isLoadingAccounts } = useCashAccounts()
  const recordPayment = useRecordPayment()
  const operation = useConfirmedOperation({
    submit: (values: PaymentFormValues, operationId) => recordPayment.mutateAsync(toRecordPaymentRequest(values, operationId)),
    onSuccess: () => onClose(),
  })

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      studentId: preselectedStudentId ?? '',
      cashAccountId: '',
      paymentMethod: PAYMENT_METHOD.Cash,
      groupId: '',
      billingPeriod: toMonthPeriod(),
      comment: '',
    },
  })
  const { control, getValues, setValue } = form

  useEffect(() => {
    if (accounts.length > 0 && !getValues('cashAccountId')) {
      setValue('cashAccountId', getDefaultAccountId(accounts))
    }
  }, [accounts, getValues, setValue])

  const [studentId, amount] = useWatch({ control, name: ['studentId', 'amount'] })
  const { data: student } = useStudentDetail(studentId)


  const pendingAmount = operation.pendingValues?.amount ?? 0

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-drawer-title"
        className="relative z-10 w-full max-w-md bg-white h-full shadow-xl flex flex-col"
      >
        <header className="flex items-start justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 id="payment-drawer-title" className="text-sm font-semibold text-heading">
              {t.finance.drawer.title}
            </h2>
            <p className="text-[11px] text-caption mt-0.5">{t.finance.drawer.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label={t.ui.close}>
            <X className="w-4 h-4" />
          </Button>
        </header>

        <form
          id="payment-form"
          noValidate
          onSubmit={form.handleSubmit(operation.requestConfirm)}
          className="flex-1 overflow-y-auto p-5"
        >
          <PaymentFormFields
            form={form}
            accounts={accounts}
            isLoadingAccounts={isLoadingAccounts}
            groups={student?.enrolledGroups ?? []}
            selectedStudent={student ? { id: student.id, fullName: student.fullName } : undefined}
          />
        </form>

        <footer className="px-5 py-4 border-t border-border bg-canvas space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-caption">{t.finance.drawer.total}</span>
            <span className="font-bold text-success-ink text-sm tabular-nums">
              {formatCurrency(Number.isFinite(amount) ? amount : 0)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              form="payment-form"
              variant="primary"
              className="flex-1"
              isLoading={recordPayment.isPending}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.finance.drawer.submit}</span>
            </Button>
          </div>
        </footer>
      </aside>

      <ConfirmDialog
        isOpen={operation.isConfirmOpen}
        onClose={operation.cancel}
        onConfirm={() => void operation.confirm()}
        variant="primary"
        title={t.finance.drawer.confirmTitle}
        description={interpolate(t.finance.drawer.confirmDescription, {
          student: student?.fullName ?? '',
          amount: formatCurrency(pendingAmount),
        })}
        isLoading={recordPayment.isPending}
      />
    </div>
  )
}
