import { Badge } from '@/components/ui/Badge'
import { useTranslation } from '@/i18n'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { ExpenseResponse } from '../../types/financeTypes'
import { CELL_CLASS, DataTable, type TableColumn } from '@/components/ui/DataTable'

interface ExpensesTableProps {
  expenses: ExpenseResponse[]
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  const { t } = useTranslation()
  const labels = t.expenses.columns

  const columns: TableColumn[] = [
    { key: 'date', label: labels.date },
    { key: 'category', label: labels.category },
    { key: 'description', label: labels.description },
    { key: 'recipient', label: labels.recipient },
    { key: 'account', label: labels.account },
    { key: 'amount', label: labels.amount, align: 'right' },
  ]

  return (
    <DataTable columns={columns}>
      {expenses.map((expense) => (
        <tr key={expense.id} className="hover:bg-surface-tint transition-colors">
          <td className={`${CELL_CLASS} text-copy tabular-nums whitespace-nowrap`}>
            {formatDate(expense.expenseDate)}
          </td>
          <td className={CELL_CLASS}>
            <Badge>{expense.expenseCategoryName}</Badge>
          </td>
          <td className={`${CELL_CLASS} text-heading max-w-xs`}>
            <span className="line-clamp-2">{expense.description}</span>
          </td>
          <td className={`${CELL_CLASS} text-copy`}>{expense.recipient ?? '—'}</td>
          <td className={`${CELL_CLASS} text-copy`}>{expense.cashAccountName}</td>
          <td className={`${CELL_CLASS} text-right font-bold text-debt-ink tabular-nums`}>
            {formatCurrency(expense.amount)}
          </td>
        </tr>
      ))}
    </DataTable>
  )
}
