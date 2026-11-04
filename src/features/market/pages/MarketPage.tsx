import { useState } from 'react'
import { Gift, Coins, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface MarketItem {
  id: string
  title: string
  coinsPrice: number
  inStock: number
  imageDesc: string
}

const ITEMS: MarketItem[] = [
  {
    id: 'it-1',
    title: 'Zucco Бренд Худи (Black/Green)',
    coinsPrice: 150,
    inStock: 8,
    imageDesc: 'Сифатли оғир матоли худи',
  },
  {
    id: 'it-2',
    title: 'Металл Термос (500ml)',
    coinsPrice: 90,
    inStock: 14,
    imageDesc: 'Иссиқликни 12 соат сақлайди',
  },
  {
    id: 'it-3',
    title: 'IELTS Real Mock Exam Ваучери',
    coinsPrice: 120,
    inStock: 25,
    imageDesc: 'Тўлиқ ҳақиқий синов имтиҳони',
  },
  {
    id: 'it-4',
    title: 'Zucco Блокнот ва Металл Ручка тўплами',
    coinsPrice: 45,
    inStock: 30,
    imageDesc: 'Қайдлар учун махсус дизайн',
  },
]

export function MarketPage() {
  const [items, setItems] = useState<MarketItem[]>(ITEMS)

  const handlePurchase = (item: MarketItem) => {
    if (item.inStock <= 0) {
      toast.error('Ушбу совға ҳозирда қолмаган!')
      return
    }
    toast.success(`«${item.title}» муваффақиятли харид қилинди! -${item.coinsPrice} танга`)
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, inStock: i.inStock - 1 } : i))
    )
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Мукофотлар маркети
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Талабалар давомат ва фаоллик учун тўплаган тангаларига совғалар харид қилиш бўлими
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] px-3 py-1.5 rounded-md text-xs font-semibold tabular-nums">
          <Coins className="w-4 h-4 text-[#D97706]" />
          <span>Фаол тангалар тизими ишламоқда</span>
        </div>
      </div>

      {/* Market Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BBDCCB] transition-colors"
          >
            <div className="space-y-3">
              <div className="w-full h-32 bg-[#F6F8F7] rounded-md border border-[#E3EAE5] flex items-center justify-center text-[#146B52]">
                <Gift className="w-10 h-10 opacity-70" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E2B24]">{item.title}</h3>
                <p className="text-xs text-[#65776C] mt-0.5">{item.imageDesc}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0F4F1] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#92400E] font-bold text-base tabular-nums">
                  <Coins className="w-4 h-4 text-[#D97706]" />
                  <span>{item.coinsPrice}</span>
                </div>
                <span className="text-[10px] text-[#8B9C91]">
                  Қолдиқ: {item.inStock} та
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handlePurchase(item)}
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Харид</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
