import { useState } from 'react'
import { MinusCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ExpenseModal } from '../components/ExpenseModal'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { ExpenseTransaction } from '../types/financeTypes'

const INITIAL_EXPENSES: ExpenseTransaction[] = [
  {
    id: 'exp-1',
    accountId: 'acc-1',
    accountName: 'Асосий нақд касса',
    categoryId: 'cat-2',
    categoryName: 'Бино ижараси',
    amount: 8500000,
    recipient: 'Чилонзор Бизнес Маркази',
    comment: 'Ноябрь ойи ижара тўлови',
    createdAt: '2026-11-01T10:00:00Z',
  },
  {
    id: 'exp-2',
    accountId: 'acc-1',
    accountName: 'Асосий нақд касса',
    categoryId: 'cat-1',
    categoryName: 'Канцелярия моллари',
    amount: 320000,
    recipient: 'Korzinka',
    comment: 'Оқ доска маркерлари ва А4 қоғоз',
    createdAt: '2026-11-02T14:30:00Z',
  },
  {
    id: 'exp-3',
    accountId: 'acc-2',
    accountName: 'Терминал ҳисоби',
    categoryId: 'cat-3',
    categoryName: 'Интернет ва алоқа',
    amount: 450000,
    recipient: 'Sarkor Telecom',
    comment: 'Оптик толали юқори тезликдаги интернет',
    createdAt: '2026-11-02T16:00:00Z',
  },
]

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseTransaction[]>(INITIAL_EXPENSES)
  const [isExpenseOpen, setIsExpenseOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Харажатлар журналы
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Кассадан чиқим қилинган барча оператив ва маъмурий харажатлар
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setIsExpenseOpen(true)}
        >
          <MinusCircle className="w-3.5 h-3.5" />
          <span>Янги харажат қайд этиш</span>
        </Button>
      </div>

      <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F8F7] border-b border-[#E3EAE5] text-[#65776C] text-[11px] font-semibold">
              <th className="py-3 px-4">Сана</th>
              <th className="py-3 px-4">Категория</th>
              <th className="py-3 px-4">Олувчи / Изоҳ</th>
              <th className="py-3 px-4">Ҳисоб</th>
              <th className="py-3 px-4 text-right">Сумма</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4F1]">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-[#FCFEFC] transition-colors">
                <td className="py-3 px-4 text-[#8B9C91] tabular-nums">
                  {formatDate(exp.createdAt)}
                </td>
                <td className="py-3 px-4">
                  <Badge variant="accent">{exp.categoryName}</Badge>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-[#1E2B24] block">
                    {exp.recipient || '—'}
                  </span>
                  <span className="text-[11px] text-[#65776C]">{exp.comment}</span>
                </td>
                <td className="py-3 px-4 text-[#4D6255]">{exp.accountName}</td>
                <td className="py-3 px-4 text-right tabular-nums">
                  <span className="font-bold text-[#BE123C] text-sm">
                    -{formatCurrency(exp.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExpenseModal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        onSuccess={(data) => {
          const newExp: ExpenseTransaction = {
            id: `exp-${Date.now()}`,
            accountId: data.accountId,
            accountName: data.accountId === 'acc-1' ? 'Асосий нақд касса' : 'Терминал ҳисоби',
            categoryId: data.categoryId,
            categoryName: 'Канцелярия ва хўжалик',
            amount: data.amount,
            recipient: data.recipient,
            comment: data.comment,
            createdAt: new Date().toISOString(),
          }
          setExpenses([newExp, ...expenses])
        }}
      />
    </div>
  )
}
