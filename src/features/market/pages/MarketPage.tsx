import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { PageHeader } from '@/components/ui/PageHeader'
import { MarketItemsGrid } from '../components/MarketItemsGrid'
import { MarketItemFormModal } from '../components/MarketItemFormModal'
import { PurchaseModal } from '../components/PurchaseModal'
import { OrdersSection } from '../components/OrdersSection'
import type { MarketItem } from '../types/marketTypes'

/** `undefined` — forma yopiq, `null` — yangi mahsulot. */
type EditingItem = MarketItem | null | undefined

export function MarketPage() {
  const { t } = useTranslation()
  const [editingItem, setEditingItem] = useState<EditingItem>(undefined)
  const [purchaseItem, setPurchaseItem] = useState<MarketItem | null>(null)

  const openCreate = () => setEditingItem(null)

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.market.title}
        subtitle={t.market.subtitle}
        actions={
          <PermissionGuard permission={PERMISSIONS.GAMIFICATION.ITEMS_MANAGE}>
            <Button variant="primary" size="sm" onClick={openCreate}>
              <Plus className="w-3.5 h-3.5" />
              <span>{t.market.newItem}</span>
            </Button>
          </PermissionGuard>
        }
      />

      <ErrorBoundary>
        <MarketItemsGrid onCreate={openCreate} onEdit={setEditingItem} onPurchase={setPurchaseItem} />
      </ErrorBoundary>

      <PermissionGuard permission={PERMISSIONS.GAMIFICATION.ORDERS_MANAGE}>
        <ErrorBoundary>
          <OrdersSection />
        </ErrorBoundary>
      </PermissionGuard>

      {editingItem !== undefined && (
        <MarketItemFormModal item={editingItem} onClose={() => setEditingItem(undefined)} />
      )}
      {purchaseItem && <PurchaseModal item={purchaseItem} onClose={() => setPurchaseItem(null)} />}
    </div>
  )
}
