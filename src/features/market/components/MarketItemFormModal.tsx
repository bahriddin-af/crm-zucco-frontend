import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'
import { CheckboxField } from '@/components/forms/CheckboxField'
import { FormField } from '@/components/forms/FormField'
import { TextAreaInput } from '@/components/forms/TextAreaInput'
import { useUpsertMarketItem } from '../hooks/useMarket'
import { createMarketItemSchema, type MarketItemFormValues } from '../types/marketSchemas'
import type { MarketItem } from '../types/marketTypes'

const FORM_ID = 'market-item-form'

interface MarketItemFormModalProps {
  /** `null` — yangi mahsulot. */
  item: MarketItem | null
  onClose: () => void
}

const toFormValues = (item: MarketItem | null): MarketItemFormValues => ({
  name: item?.name ?? '',
  priceInCoins: item?.priceInCoins ?? Number.NaN,
  stockQuantity: item?.stockQuantity ?? 0,
  description: item?.description ?? '',
  imageUrl: item?.imageUrl ?? '',
  isActive: item?.isActive ?? true,
})

const emptyToNull = (value: string): string | null => (value.length > 0 ? value : null)

export function MarketItemFormModal({ item, onClose }: MarketItemFormModalProps) {
  const { t } = useTranslation()
  const schema = useMemo(() => createMarketItemSchema(t), [t])
  const upsert = useUpsertMarketItem()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MarketItemFormValues>({ resolver: zodResolver(schema), defaultValues: toFormValues(item) })

  const onSubmit = async (values: MarketItemFormValues) => {
    await upsert.mutateAsync({
      id: item?.id ?? null,
      name: values.name,
      priceInCoins: values.priceInCoins,
      stockQuantity: values.stockQuantity,
      description: emptyToNull(values.description),
      imageUrl: emptyToNull(values.imageUrl),
      isActive: values.isActive,
    })
    toast.success(t.market.itemSaved)
    onClose()
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={item ? t.market.editItem : t.market.newItem}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button variant="primary" size="sm" type="submit" form={FORM_ID} isLoading={upsert.isPending}>
            {t.common.save}
          </Button>
        </>
      }
    >
      <form
        id={FORM_ID}
        className="space-y-3"
        noValidate
        onSubmit={handleSubmit((values) => onSubmit(values).catch(() => undefined))}
      >
        <FormField label={t.market.itemName} htmlFor="item-name" error={errors.name?.message}>
          <Input id="item-name" {...register('name')} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label={t.market.priceInCoins} htmlFor="item-price" error={errors.priceInCoins?.message}>
            <Input id="item-price" type="number" min={1} step={1} {...register('priceInCoins', { valueAsNumber: true })} />
          </FormField>
          <FormField label={t.market.stockQuantity} htmlFor="item-stock" error={errors.stockQuantity?.message}>
            <Input id="item-stock" type="number" min={0} step={1} {...register('stockQuantity', { valueAsNumber: true })} />
          </FormField>
        </div>
        <FormField label={t.market.itemDescription} htmlFor="item-description">
          <TextAreaInput id="item-description" rows={3} {...register('description')} />
        </FormField>
        <FormField label={t.market.imageUrl} htmlFor="item-image">
          <Input id="item-image" type="url" {...register('imageUrl')} />
        </FormField>
        <CheckboxField id="item-active" label={t.market.isActive} {...register('isActive')} />
      </form>
    </Modal>
  )
}
