import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { FormField } from '@/components/forms/FormField'
import { TextAreaInput } from '@/components/forms/TextAreaInput'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { useConfirmedOperation } from '@/hooks/useConfirmedOperation'
import { useVoidPayment } from '../../hooks/useFinance'
import { createVoidPaymentSchema, type VoidPaymentFormValues } from '../../schemas/financeSchemas'
import { FINANCE_TEXT_LIMITS, type PaymentResponse } from '../../types/financeTypes'

interface PaymentVoidModalProps {
  payment: PaymentResponse
  onClose: () => void
}

const FORM_ID = 'payment-void-form'

/**
 * To'lovni bekor qilish: sabab (RHF + Zod) → `ConfirmDialog` → bitta `operationId` bilan yuborish.
 * Tarmoq xatosidan keyin qayta tasdiqlash o'sha kalitni ishlatadi (backend ikki marta qaytarmaydi).
 */
export function PaymentVoidModal({ payment, onClose }: PaymentVoidModalProps) {
  const { t } = useTranslation()
  const text = t.finance.voidPayment
  const schema = useMemo(() => createVoidPaymentSchema(t), [t])
  const voidPayment = useVoidPayment()
  const operation = useConfirmedOperation({
    submit: (values: VoidPaymentFormValues, operationId) =>
      voidPayment.mutateAsync({ paymentId: payment.id, reason: values.reason, operationId }),
    onSuccess: () => onClose(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VoidPaymentFormValues>({ resolver: zodResolver(schema), defaultValues: { reason: '' } })
  const amount = formatCurrency(payment.amount)

  return (
    <>
      <Modal
        isOpen
        onClose={onClose}
        title={text.title}
        description={text.description}
        footer={
          <>
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button type="submit" form={FORM_ID} variant="danger" size="sm">
              {text.submit}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} noValidate onSubmit={handleSubmit(operation.requestConfirm)} className="space-y-4">
          <p className="text-xs text-copy">
            {interpolate(text.summary, { student: payment.studentName, amount, receipt: payment.receiptNumber })}
          </p>
          <FormField label={text.reason} htmlFor="void-reason" required error={errors.reason?.message}>
            <TextAreaInput
              id="void-reason"
              rows={3}
              maxLength={FINANCE_TEXT_LIMITS.PAYMENT_VOID_REASON}
              placeholder={text.reasonPlaceholder}
              hasError={Boolean(errors.reason)}
              {...register('reason')}
            />
          </FormField>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={operation.isConfirmOpen}
        onClose={operation.cancel}
        onConfirm={() => void operation.confirm()}
        title={text.confirmTitle}
        description={interpolate(text.confirmDescription, { student: payment.studentName, amount })}
        confirmLabel={text.confirm}
        isLoading={operation.isSubmitting}
      />
    </>
  )
}
