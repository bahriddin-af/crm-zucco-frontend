import { Gift, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { useMarketItems } from '../hooks/useMarket'
import type { MarketItem } from '../types/marketTypes'
import { MarketItemCard } from './MarketItemCard'

const SKELETON_CARDS = 4
const GRID_CLASS = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'

interface MarketItemsGridProps {
  onCreate: () => void
  onEdit: (item: MarketItem) => void
  onPurchase: (item: MarketItem) => void
}

export function MarketItemsGrid({ onCreate, onEdit, onPurchase }: MarketItemsGridProps) {
  const { t } = useTranslation()
  const { data: items, isLoading, isError, error, refetch } = useMarketItems()

  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: SKELETON_CARDS }, (_, index) => (
          <Skeleton key={index} className="h-64" />
        ))}
      </div>
    )
  }

  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={<Gift className="w-5 h-5" />}
        title={t.market.emptyItems}
        description={t.market.emptyItemsDescription}
        action={
          <PermissionGuard permission={PERMISSIONS.GAMIFICATION.ITEMS_MANAGE}>
            <Button variant="primary" size="sm" onClick={onCreate}>
              <Plus className="w-3.5 h-3.5" />
              <span>{t.market.newItem}</span>
            </Button>
          </PermissionGuard>
        }
      />
    )
  }

  return (
    <div className={GRID_CLASS}>
      {items.map((item) => (
        <MarketItemCard key={item.id} item={item} onEdit={onEdit} onPurchase={onPurchase} />
      ))}
    </div>
  )
}
