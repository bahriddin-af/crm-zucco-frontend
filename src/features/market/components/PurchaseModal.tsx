import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ShoppingBag } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { interpolate, useTranslation } from '@/i18n'
import { formatCoins } from '@/utils/formatters'
import { usePurchaseMarketItem } from '../hooks/useMarket'
import { useConfirmedOperation } from '@/hooks/useConfirmedOperation'
import { createPurchaseSchema, type PurchaseFormValues } from '../types/marketSchemas'
import type { MarketItem } from '../types/marketTypes'
import { StudentPicker } from './StudentPicker'

const FORM_ID = 'market-purchase-form'

interface PurchaseModalProps {
  item: MarketItem
  onClose: () => void
}

/** Talaba nomidan sovg'a xarid qilish: tanga yechiladi, shuning uchun tasdiqlash majburiy. */
export function PurchaseModal({ item, onClose }: PurchaseModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createPurchaseSchema(t), [t])
  const purchase = usePurchaseMarketItem()
  const [studentName, setStudentName] = useState('')

  const { control, handleSubmit } = useForm<PurchaseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { studentId: '' },
  })

  const operation = useConfirmedOperation({
    submit: (values: PurchaseFormValues, operationId) =>
      purchase.mutateAsync({ studentId: values.studentId, marketItemId: item.id, operationId }),
    onSuccess: () => {
      toast.success(interpolate(t.market.purchaseSuccess, { item: item.name }))
      onClose()
    },
  })

  return (
    <>
      <Modal
        isOpen
        onClose={onClose}
        title={t.market.purchaseTitle}
        description={interpolate(t.market.purchaseFor, { item: item.name, price: formatCoins(item.priceInCoins) })}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button variant="primary" size="sm" type="submit" form={FORM_ID}>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.market.purchase}</span>
            </Button>
          </>
        }
      >
        <form id={FORM_ID} onSubmit={handleSubmit(operation.requestConfirm)} noValidate>
          <Controller
            control={control}
            name="studentId"
            render={({ field, fieldState }) => (
              <StudentPicker
                id="purchase-student"
                value={field.value}
                error={fieldState.error?.message}
                onChange={(studentId, name) => {
                  field.onChange(studentId)
                  setStudentName(name)
                }}
              />
            )}
          />
        </form>
      </Modal>
      <ConfirmDialog
        isOpen={operation.isConfirmOpen}
        variant="primary"
        isLoading={operation.isSubmitting}
        onClose={operation.cancel}
        onConfirm={() => void operation.confirm()}
        confirmLabel={t.market.purchase}
        description={interpolate(t.market.purchaseConfirm, {
          student: studentName,
          item: item.name,
          price: formatCoins(item.priceInCoins),
        })}
      />
    </>
  )
}
