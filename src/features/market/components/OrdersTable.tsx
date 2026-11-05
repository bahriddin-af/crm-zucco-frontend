import { PackageCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'
import { formatCoins, formatDate } from '@/utils/formatters'
import { ORDER_STATUS, type MarketOrder, type OrderStatus } from '../types/marketTypes'

const STATUS_BADGE: Record<OrderStatus, 'warning' | 'success' | 'default'> = {
  [ORDER_STATUS.Pending]: 'warning',
  [ORDER_STATUS.Delivered]: 'success',
  [ORDER_STATUS.Cancelled]: 'default',
}

interface OrdersTableProps {
  orders: MarketOrder[]
  onDeliver: (order: MarketOrder) => void
}

export function OrdersTable({ orders, onDeliver }: OrdersTableProps) {
  const { t } = useTranslation()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-canvas border-b border-border text-caption text-[11px] font-semibold">
            <th className="py-2.5 px-3">{t.market.orderStudent}</th>
            <th className="py-2.5 px-3">{t.market.orderItem}</th>
            <th className="py-2.5 px-3 text-right">{t.market.priceInCoins}</th>
            <th className="py-2.5 px-3">{t.market.orderedAt}</th>
            <th className="py-2.5 px-3">{t.common.status}</th>
            <th className="py-2.5 px-3 text-right">{t.common.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-divider">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-surface-tint transition-colors">
              <td className="py-2.5 px-3 font-semibold text-heading">{order.studentName}</td>
              <td className="py-2.5 px-3 text-copy-strong">{order.itemName}</td>
              <td className="py-2.5 px-3 text-right tabular-nums">{formatCoins(order.priceInCoins)}</td>
              <td className="py-2.5 px-3 text-subtle tabular-nums">
                {formatDate(order.orderedAt)}
                {order.deliveredAt && <span className="block">{formatDate(order.deliveredAt)}</span>}
              </td>
              <td className="py-2.5 px-3">
                <Badge variant={STATUS_BADGE[order.status]}>{t.market.orderStatuses[order.status]}</Badge>
              </td>
              <td className="py-2.5 px-3 text-right">
                {order.status === ORDER_STATUS.Pending && (
                  <Button variant="outline" size="sm" onClick={() => onDeliver(order)}>
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>{t.market.deliver}</span>
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
