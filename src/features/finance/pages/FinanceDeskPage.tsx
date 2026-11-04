import { useState } from 'react'
import {
  Wallet,
  Plus,
  MinusCircle,
  Receipt,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PaymentDrawer } from '../components/PaymentDrawer'
import { ExpenseModal } from '../components/ExpenseModal'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { useTranslation } from '@/i18n'
import type { PaymentTransaction, CashAccount } from '../types/financeTypes'

const INITIAL_ACCOUNTS: CashAccount[] = [
  { id: 'acc-1', name: 'Асосий нақд касса', balance: 18450000, currency: 'UZS' },
  { id: 'acc-2', name: 'Humo / Uzcard терминал', balance: 14200000, currency: 'UZS' },
  { id: 'acc-3', name: 'Payme Business ҳисоб', balance: 9850000, currency: 'UZS' },
]

const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-1',
    studentId: 'zu-0248',
    studentName: 'Темур Бекмирзаев',
    studentCode: 'ZU-0248',
    accountId: 'acc-1',
    accountName: 'Асосий нақд касса',
    amount: 600000,
    method: 'Cash',
    billingPeriod: '2026-11',
    groupName: 'IELTS Foundation',
    createdAt: '2026-11-03T11:20:00Z',
    receiptNumber: 'CHK-9041',
  },
  {
    id: 'tx-2',
    studentId: 'zu-0189',
    studentName: 'Шаҳзода Низомова',
    studentCode: 'ZU-0189',
    accountId: 'acc-2',
    accountName: 'Humo / Uzcard терминал',
    amount: 800000,
    method: 'Card',
    billingPeriod: '2026-11',
    groupName: 'Frontend React',
    createdAt: '2026-11-03T10:45:00Z',
    receiptNumber: 'CHK-9040',
  },
  {
    id: 'tx-3',
    studentId: 'zu-0155',
    studentName: 'Камила Исмоилова',
    studentCode: 'ZU-0155',
    accountId: 'acc-3',
    accountName: 'Payme Business',
    amount: 400000,
    method: 'Payme',
    billingPeriod: '2026-11',
    groupName: 'Matematika Intensive',
    createdAt: '2026-11-02T16:15:00Z',
    receiptNumber: 'CHK-9039',
  },
]

export function FinanceDeskPage() {
  const { t } = useTranslation()
  const [accounts, setAccounts] = useState<CashAccount[]>(INITIAL_ACCOUNTS)
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS)
  const [search, setSearch] = useState('')

  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isExpenseOpen, setIsExpenseOpen] = useState(false)

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

  const filteredTransactions = transactions.filter(
    (tItem) =>
      tItem.studentName.toLowerCase().includes(search.toLowerCase()) ||
      tItem.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      (tItem.receiptNumber && tItem.receiptNumber.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            {t.finance.title}
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            {t.finance.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpenseOpen(true)}
            className="text-[#BE123C]"
          >
            <MinusCircle className="w-3.5 h-3.5" />
            <span>{t.finance.recordExpense}</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPaymentOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.finance.acceptPayment}</span>
          </Button>
        </div>
      </div>

      {/* Account Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Overall Balance */}
        <div className="p-4 bg-white border border-[#146B52] rounded-lg shadow-xs bg-linear-to-br from-white to-[#E8F3ED]/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#146B52]">
              {t.finance.totalBalance}
            </span>
            <div className="w-7 h-7 rounded-md bg-[#146B52] text-white flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1E2B24] tabular-nums tracking-tight">
            {formatCurrency(totalBalance)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-[#047857]">
            <span>3 та фаол ҳисоб бўйича</span>
          </div>
        </div>

        {/* Separate Accounts */}
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="p-4 bg-white border border-[#E3EAE5] rounded-lg shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-[#65776C] truncate">
                {acc.name}
              </span>
              <div className="w-6 h-6 rounded bg-[#F6F8F7] text-[#65776C] flex items-center justify-center">
                <Receipt className="w-3 h-3" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#1E2B24] tabular-nums tracking-tight">
              {formatCurrency(acc.balance)}
            </div>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-[#65776C]">
              <span>Тайёр қолдиқ</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[#E3EAE5]">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-[#1E2B24]">
              Охирги молиявий амаллар
            </h2>
            <Badge variant="accent">{filteredTransactions.length} та амал</Badge>
          </div>

          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B9C91]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Талаба ёки чек рақами бўйича..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#F6F8F7] border border-[#E3EAE5] rounded-md text-[#1E2B24] placeholder:text-[#8B9C91] focus:outline-none focus:ring-1 focus:ring-[#146B52]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F6F8F7] border-b border-[#E3EAE5] text-[#65776C] text-[11px] font-semibold">
                <th className="py-3 px-4">{t.finance.receiptNo}</th>
                <th className="py-3 px-4">{t.common.studentUnit}</th>
                <th className="py-3 px-4">Гуруҳ / Давр</th>
                <th className="py-3 px-4">{t.finance.accountAndMethod}</th>
                <th className="py-3 px-4 text-right">{t.common.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F1]">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FCFEFC] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#1E2B24] block">
                      {tx.receiptNumber || 'CHK-AUTO'}
                    </span>
                    <span className="text-[10px] text-[#8B9C91]">
                      {formatDate(tx.createdAt)}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#1E2B24] block">
                      {tx.studentName}
                    </span>
                    <span className="text-[10px] text-[#8B9C91]">
                      {tx.studentCode}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-[#4D6255]">
                    <span>{tx.groupName || 'Умумий тўлов'}</span>
                    <span className="text-[10px] text-[#8B9C91] block">
                      Ой: {tx.billingPeriod || 'Жорий'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <Badge variant="accent">{tx.method}</Badge>
                    <span className="text-[10px] text-[#8B9C91] block mt-0.5">
                      {tx.accountName}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right tabular-nums">
                    <span className="font-bold text-[#047857] text-sm">
                      +{formatCurrency(tx.amount)}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-[#8B9C91]">
                    {t.common.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Drawer */}
      <PaymentDrawer
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={(data) => {
          const newTx: PaymentTransaction = {
            id: `tx-${Date.now()}`,
            studentId: data.studentId,
            studentName: 'Темур Бекмирзаев',
            studentCode: 'ZU-0248',
            accountId: data.accountId,
            accountName:
              data.accountId === 'acc-1'
                ? 'Асосий нақд касса'
                : 'Терминал ҳисоби',
            amount: data.amount,
            method: data.method,
            billingPeriod: data.billingPeriod,
            groupName: 'IELTS Foundation',
            createdAt: new Date().toISOString(),
            receiptNumber: `CHK-${Math.floor(1000 + Math.random() * 9000)}`,
          }
          setTransactions([newTx, ...transactions])
          setAccounts((prev) =>
            prev.map((a) =>
              a.id === data.accountId
                ? { ...a, balance: a.balance + data.amount }
                : a
            )
          )
        }}
      />

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        onSuccess={(data) => {
          setAccounts((prev) =>
            prev.map((a) =>
              a.id === data.accountId
                ? { ...a, balance: a.balance - data.amount }
                : a
            )
          )
        }}
      />
    </div>
  )
}
