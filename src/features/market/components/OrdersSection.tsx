import { useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { interpolate, useTranslation } from '@/i18n'
import { SectionCard } from '@/components/ui/SectionCard'
import { ListSkeleton } from '@/components/ui/ListSkeleton'
import { SelectInput } from '@/components/forms/SelectInput'
import { useDeliverOrder, useMarketOrders } from '../hooks/useMarket'
import { MARKET_PAGE_SIZE, ORDER_STATUS, type MarketOrder, type OrderStatus } from '../types/marketTypes'
import { OrdersTable } from './OrdersTable'

const ORDER_STATUSES = Object.values(ORDER_STATUS)

/** Buyurtmalar ro'yxati (sahifalangan, holat bo'yicha filtr) va "topshirildi" amali. */
export function OrdersSection() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<OrderStatus | undefined>(ORDER_STATUS.Pending)
  const [orderToDeliver, setOrderToDeliver] = useState<MarketOrder | null>(null)
  const { data, isLoading, isError, error, refetch } = useMarketOrders({ page, pageSize: MARKET_PAGE_SIZE, status })
  const deliver = useDeliverOrder()

  const handleStatusChange = (value: string) => {
    const next = ORDER_STATUSES.find((option) => String(option) === value)
    setStatus(next)
    setPage(1)
  }

  const confirmDeliver = () => {
    if (!orderToDeliver) return
    deliver.mutate(orderToDeliver.id, {
      onSuccess: () => toast.success(t.market.deliveredToast),
      onSettled: () => setOrderToDeliver(null),
    })
  }

  return (
    <SectionCard
      title={t.market.orders}
      actions={
        <SelectInput
          className="w-auto"
          aria-label={t.market.statusFilter}
          value={status ?? ''}
          onChange={(event) => handleStatusChange(event.target.value)}
        >
          <option value="">{t.common.all}</option>
          {ORDER_STATUSES.map((option) => (
            <option key={option} value={option}>
              {t.market.orderStatuses[option]}
            </option>
          ))}
        </SelectInput>
      }
    >
      {isLoading && <ListSkeleton />}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {data && data.items.length === 0 && <EmptyState title={t.market.emptyOrders} />}
      {data && data.items.length > 0 && (
        <>
          <OrdersTable orders={data.items} onDeliver={setOrderToDeliver} />
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
      <ConfirmDialog
        isOpen={orderToDeliver !== null}
        variant="primary"
        isLoading={deliver.isPending}
        onClose={() => setOrderToDeliver(null)}
        onConfirm={confirmDeliver}
        confirmLabel={t.market.deliver}
        description={interpolate(t.market.deliverConfirm, {
          item: orderToDeliver?.itemName ?? '',
          student: orderToDeliver?.studentName ?? '',
        })}
      />
    </SectionCard>
  )
}
