import { Coins, Gift, Pencil, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import type { MarketItem } from '../types/marketTypes'

interface MarketItemCardProps {
  item: MarketItem
  onEdit: (item: MarketItem) => void
  onPurchase: (item: MarketItem) => void
}

export function MarketItemCard({ item, onEdit, onPurchase }: MarketItemCardProps) {
  const { t } = useTranslation()
  const isOutOfStock = item.stockQuantity <= 0
  const canPurchase = item.isActive && !isOutOfStock

  return (
    <article className="bg-white border border-border rounded-lg p-4 shadow-xs flex flex-col justify-between gap-4 hover:border-primary-line transition-colors">
      <div className="space-y-3">
        <div className="w-full h-32 bg-canvas rounded-md border border-border flex items-center justify-center text-primary overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <Gift className="w-10 h-10 opacity-70" />
          )}
        </div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-heading">{item.name}</h3>
            {!item.isActive && <Badge variant="warning">{t.market.hiddenFromMarket}</Badge>}
            {item.description && <p className="text-xs text-caption mt-0.5">{item.description}</p>}
          </div>
          <PermissionGuard permission={PERMISSIONS.GAMIFICATION.ITEMS_MANAGE}>
            <Button variant="ghost" size="icon" aria-label={t.market.editItem} onClick={() => onEdit(item)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <div className="pt-3 border-t border-divider flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1 text-warning-ink font-bold text-base tabular-nums">
            <Coins className="w-4 h-4 text-warning-strong" />
            <span>{item.priceInCoins}</span>
          </div>
          {isOutOfStock ? (
            <Badge variant="danger">{t.market.outOfStock}</Badge>
          ) : (
            <span className="text-[10px] text-subtle">{interpolate(t.market.inStock, { count: item.stockQuantity })}</span>
          )}
        </div>
        <PermissionGuard permission={PERMISSIONS.GAMIFICATION.PURCHASE}>
          <Button variant="primary" size="sm" disabled={!canPurchase} onClick={() => onPurchase(item)}>
            <ShoppingBag className="w-3 h-3" />
            <span>{t.market.purchase}</span>
          </Button>
        </PermissionGuard>
      </div>
    </article>
  )
}
