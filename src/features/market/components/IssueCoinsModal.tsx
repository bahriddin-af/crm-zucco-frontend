import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { interpolate, useTranslation } from '@/i18n'
import { formatCoins } from '@/utils/formatters'
import { useIssueCoins } from '../hooks/useMarket'
import { useConfirmedOperation } from '@/hooks/useConfirmedOperation'
import { FormField } from '@/components/forms/FormField'
import { SelectInput } from '@/components/forms/SelectInput'
import { TextAreaInput } from '@/components/forms/TextAreaInput'
import { createIssueCoinsSchema, type IssueCoinsFormValues } from '../types/marketSchemas'
import { COIN_REASON, ISSUABLE_COIN_REASONS } from '../types/marketTypes'
import { StudentPicker } from './StudentPicker'

const FORM_ID = 'issue-coins-form'

interface IssueCoinsModalProps {
  onClose: () => void
}

/** Talabaga tanga berish/kamaytirish: bitta `operationId` + tasdiqlash oynasi. */
export function IssueCoinsModal({ onClose }: IssueCoinsModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createIssueCoinsSchema(t), [t])
  const issueCoins = useIssueCoins()
  const [studentName, setStudentName] = useState('')
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueCoinsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { studentId: '', amount: Number.NaN, reason: COIN_REASON.ManualAdjustment, description: '' },
  })

  const operation = useConfirmedOperation({
    submit: (values: IssueCoinsFormValues, operationId) =>
      issueCoins.mutateAsync({
        studentId: values.studentId,
        amount: values.amount,
        reason: values.reason,
        description: values.description.length > 0 ? values.description : null,
        operationId,
      }),
    onSuccess: () => {
      toast.success(t.coins.issueSuccess)
      onClose()
    },
  })

  const pending = operation.pendingValues

  return (
    <>
      <Modal
        isOpen
        onClose={onClose}
        title={t.coins.issueTitle}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button variant="primary" size="sm" type="submit" form={FORM_ID}>
              {t.coins.issue}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} className="space-y-3" noValidate onSubmit={handleSubmit(operation.requestConfirm)}>
          <Controller
            control={control}
            name="studentId"
            render={({ field, fieldState }) => (
              <StudentPicker
                id="issue-student"
                value={field.value}
                error={fieldState.error?.message}
                onChange={(studentId, name) => {
                  field.onChange(studentId)
                  setStudentName(name)
                }}
              />
            )}
          />
          <FormField label={t.coins.amount} htmlFor="issue-amount" hint={t.coins.amountHint} error={errors.amount?.message}>
            <Input id="issue-amount" type="number" step={1} {...register('amount', { valueAsNumber: true })} />
          </FormField>
          <FormField label={t.coins.reason} htmlFor="issue-reason" error={errors.reason?.message}>
            <SelectInput id="issue-reason" {...register('reason', { valueAsNumber: true })}>
              {ISSUABLE_COIN_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {t.coins.reasons[reason]}
                </option>
              ))}
            </SelectInput>
          </FormField>
          <FormField label={t.coins.description} htmlFor="issue-description">
            <TextAreaInput id="issue-description" rows={2} {...register('description')} />
          </FormField>
        </form>
      </Modal>
      <ConfirmDialog
        isOpen={operation.isConfirmOpen}
        variant="primary"
        isLoading={operation.isSubmitting}
        onClose={operation.cancel}
        onConfirm={() => void operation.confirm()}
        confirmLabel={t.coins.issue}
        description={interpolate(t.coins.issueConfirm, {
          student: studentName,
          amount: formatCoins(pending?.amount ?? 0),
          reason: pending ? t.coins.reasons[pending.reason] : '',
        })}
      />
    </>
  )
}
