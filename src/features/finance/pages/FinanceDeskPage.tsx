import { useState } from 'react'
import {
  Wallet,
  Plus,
  MinusCircle,
  Receipt,
  TrendingUp,
  AlertCircle,
  Building,
  CreditCard,
  Banknote,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PaymentDrawer } from '../components/PaymentDrawer'
import { ExpenseModal } from '../components/ExpenseModal'
import { formatCurrency } from '@/utils/formatters'
import { useFinanceSummary } from '../hooks/useFinance'
import { CASH_ACCOUNT_TYPE } from '../types/financeTypes'

export function FinanceDeskPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isExpenseOpen, setIsExpenseOpen] = useState(false)

  const { data: summary, isLoading } = useFinanceSummary()

  const cashAccounts = summary?.cashAccounts || []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E2B24]">Молия ва Касса</h1>
          <p className="text-sm text-[#5A6C62] mt-0.5">
            Ўқув марказининг нақд ва нақдсиз маблағлари, тўловлар ҳамда чиқимлар назорати
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-[#E11D48] border-[#E11D48]/30 hover:bg-[#E11D48]/5"
            onClick={() => setIsExpenseOpen(true)}
          >
            <MinusCircle className="w-4 h-4 mr-2" />
            Чиқим / Харажат
          </Button>

          <Button onClick={() => setIsPaymentOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Тўлов қабул қилиш
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Jami Kassa Balansi */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E9EB] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6C62] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Кассалардаги жами маблағ</span>
            <div className="w-8 h-8 rounded-lg bg-[#027A48]/10 flex items-center justify-center text-[#027A48]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-[#F0F3F1] rounded animate-pulse w-3/4"></div>
          ) : (
            <div className="text-2xl font-bold text-[#1E2B24]">
              {formatCurrency(summary?.totalCashBalance || 0)}
            </div>
          )}
          <p className="text-xs text-[#5A6C62] mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#027A48]" />
            Барча фаол касса ҳисобларида
          </p>
        </div>

        {/* Bu oydagi tushum */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E9EB] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6C62] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Ойлик тушум (Кирим)</span>
            <div className="w-8 h-8 rounded-lg bg-[#027A48]/10 flex items-center justify-center text-[#027A48]">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-[#F0F3F1] rounded animate-pulse w-3/4"></div>
          ) : (
            <div className="text-2xl font-bold text-[#027A48]">
              +{formatCurrency(summary?.totalPaymentsThisMonth || 0)}
            </div>
          )}
          <p className="text-xs text-[#5A6C62] mt-1.5">Жорий ой давомида тўланган</p>
        </div>

        {/* Bu oydagi xarajat */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E9EB] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6C62] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Ойлик чиқим (Харажат)</span>
            <div className="w-8 h-8 rounded-lg bg-[#E11D48]/10 flex items-center justify-center text-[#E11D48]">
              <MinusCircle className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-[#F0F3F1] rounded animate-pulse w-3/4"></div>
          ) : (
            <div className="text-2xl font-bold text-[#E11D48]">
              -{formatCurrency(summary?.totalExpensesThisMonth || 0)}
            </div>
          )}
          <p className="text-xs text-[#5A6C62] mt-1.5">Ижара, ойлик ва хўжалик</p>
        </div>

        {/* Qarzdorlik */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E9EB] shadow-xs">
          <div className="flex items-center justify-between text-[#5A6C62] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Жами қарздорлик</span>
            <div className="w-8 h-8 rounded-lg bg-[#D97706]/10 flex items-center justify-center text-[#D97706]">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-[#F0F3F1] rounded animate-pulse w-3/4"></div>
          ) : (
            <div className="text-2xl font-bold text-[#D97706]">
              {formatCurrency(summary?.totalStudentDebt || 0)}
            </div>
          )}
          <p className="text-xs text-[#5A6C62] mt-1.5">
            {summary?.totalDebtorsCount || 0} та талабада қарз мавжуд
          </p>
        </div>
      </div>

      {/* Cash Accounts List */}
      <div className="bg-white rounded-xl border border-[#E5E9EB] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E5E9EB] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1E2B24]">Касса ва ҳисоб рақамлари</h2>
            <p className="text-xs text-[#5A6C62]">
              Ўқув марказининг барча нақд пул, терминал ва онлайн агрегатор ҳисоблари
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-[#F8FAF9] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-[#E5E9EB]">
            {cashAccounts.map((acc) => {
              const isCash = acc.type === CASH_ACCOUNT_TYPE.Cash
              const isBank = acc.type === CASH_ACCOUNT_TYPE.BankAccount
              return (
                <div key={acc.id} className="p-5 flex items-center justify-between hover:bg-[#F8FAF9] transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#027A48]/10 flex items-center justify-center text-[#027A48]">
                      {isCash ? (
                        <Banknote className="w-5 h-5" />
                      ) : isBank ? (
                        <Building className="w-5 h-5" />
                      ) : (
                        <CreditCard className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#1E2B24]">{acc.name}</span>
                        {acc.isDefault && (
                          <Badge variant="success">Асосий</Badge>
                        )}
                      </div>
                      <span className="text-xs text-[#5A6C62]">
                        {isCash ? 'Нақд пул кассаси' : isBank ? 'Банк ҳисоб рақами' : 'Тўлов терминали / Онлайн'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-[#1E2B24]">
                      {formatCurrency(acc.balance)}
                    </div>
                    <span className="text-xs text-[#027A48] font-medium">Фаол</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Drawers and Modals */}
      <PaymentDrawer
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />

      <ExpenseModal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
      />
    </div>
  )
}
