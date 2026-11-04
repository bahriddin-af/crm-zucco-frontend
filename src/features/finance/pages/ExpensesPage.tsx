import { useState } from 'react'
import { MinusCircle, Plus, Wallet, ArrowDownRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ExpenseModal } from '../components/ExpenseModal'
import { formatCurrency } from '@/utils/formatters'
import { useFinanceSummary } from '../hooks/useFinance'

export function ExpensesPage() {
  const [isExpenseOpen, setIsExpenseOpen] = useState(false)
  const { data: summary, isLoading } = useFinanceSummary()

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Марказ харажатлари (Чиқимлар)
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Ижара, коммунал тўловлар, хўжалик ва бошқа турдаги чиқимлар журнали
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsExpenseOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Янги харажат ёзиш</span>
        </Button>
      </div>

      {/* KPI Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E5E9EB] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6C62] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Жорий ойлик чиқим</span>
            <div className="w-8 h-8 rounded-lg bg-[#E11D48]/10 flex items-center justify-center text-[#E11D48]">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-[#F0F3F1] rounded animate-pulse w-1/2" />
          ) : (
            <div className="text-2xl font-bold text-[#E11D48]">
              -{formatCurrency(summary?.totalExpensesThisMonth || 0)}
            </div>
          )}
          <p className="text-xs text-[#5A6C62] mt-1.5">Барча кассалардан чиқим қилинган</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E9EB] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6C62] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Мавжуд касса баланси</span>
            <div className="w-8 h-8 rounded-lg bg-[#027A48]/10 flex items-center justify-center text-[#027A48]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-[#F0F3F1] rounded animate-pulse w-1/2" />
          ) : (
            <div className="text-2xl font-bold text-[#1E2B24]">
              {formatCurrency(summary?.totalCashBalance || 0)}
            </div>
          )}
          <p className="text-xs text-[#5A6C62] mt-1.5">Чиқим қилиш мумкин бўлган маблағ</p>
        </div>
      </div>

      {/* Expenses Table or Placeholder */}
      <div className="bg-white border border-[#E3EAE5] rounded-xl shadow-xs overflow-hidden p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center mx-auto mb-3">
          <MinusCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-[#1E2B24]">Харажатлар журнали</h3>
        <p className="text-xs text-[#5A6C62] mt-1 max-w-sm mx-auto mb-4">
          Чиқимларни қайд этиш учун юқоридаги «Янги харажат ёзиш» тугмасини босинг.
        </p>
        <Button size="sm" onClick={() => setIsExpenseOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Харажат қўшиш
        </Button>
      </div>

      <ExpenseModal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
      />
    </div>
  )
}
