import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/formatters'

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Таҳлилий ҳисоботлар
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Молиявий динамика, ўқувчилар ўсиши ва конверсия ҳисоботлари
          </p>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="w-3.5 h-3.5" />
          <span>Excel экспорт</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-2">
          <span className="text-xs text-[#65776C]">Жорий ой соф фойдаси</span>
          <p className="text-2xl font-bold text-[#047857] tabular-nums">
            {formatCurrency(26400000)}
          </p>
          <span className="text-[10px] text-[#047857]">Ўтган ойга нисбаtan +14%</span>
        </div>

        <div className="bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-2">
          <span className="text-xs text-[#65776C]">Жами янги талабалар</span>
          <p className="text-2xl font-bold text-[#1E2B24] tabular-nums">
            34 нафар
          </p>
          <span className="text-[10px] text-[#65776C]">Конверсия: 68%</span>
        </div>

        <div className="bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-2">
          <span className="text-xs text-[#65776C]">Умумий қарздорлик</span>
          <p className="text-2xl font-bold text-[#BE123C] tabular-nums">
            {formatCurrency(5600000)}
          </p>
          <span className="text-[10px] text-[#BE123C]">14 нафар талаба</span>
        </div>
      </div>
    </div>
  )
}
