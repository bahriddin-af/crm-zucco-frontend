import { Badge } from '@/components/ui/Badge'
import { useTranslation } from '@/i18n'
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters'
import type { PaymentResponse } from '../../types/financeTypes'
import { CELL_CLASS, DataTable, type TableColumn } from '@/components/ui/DataTable'

interface PaymentsTableProps {
  payments: PaymentResponse[]
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  const { t } = useTranslation()
  const labels = t.finance.columns

  const columns: TableColumn[] = [
    { key: 'receipt', label: labels.receipt },
    { key: 'student', label: labels.student },
    { key: 'method', label: labels.method },
    { key: 'account', label: labels.account },
    { key: 'group', label: labels.group },
    { key: 'amount', label: labels.amount, align: 'right' },
    { key: 'balance', label: labels.balanceAfter, align: 'right' },
  ]

  return (
    <DataTable columns={columns}>
      {payments.map((payment) => (
        <tr key={payment.id} className="hover:bg-surface-tint transition-colors">
          <td className={CELL_CLASS}>
            <div className="font-mono text-[11px] text-heading truncate max-w-40">{payment.receiptNumber}</div>
            <div className="text-[11px] text-caption tabular-nums">
              {formatDate(payment.paymentDate)} · {formatTime(payment.paymentDate)}
            </div>
          </td>
          <td className={`${CELL_CLASS} font-semibold text-heading`}>{payment.studentName}</td>
          <td className={CELL_CLASS}>
            <Badge variant="accent">{t.finance.paymentMethods[payment.paymentMethod]}</Badge>
          </td>
          <td className={`${CELL_CLASS} text-copy`}>{payment.cashAccountName}</td>
          <td className={`${CELL_CLASS} text-copy`}>{payment.groupName ?? '—'}</td>
          <td className={`${CELL_CLASS} text-right font-bold text-success-ink tabular-nums`}>
            {formatCurrency(payment.amount)}
          </td>
          <td className={`${CELL_CLASS} text-right text-copy tabular-nums`}>
            {formatCurrency(payment.studentBalanceAfter)}
          </td>
        </tr>
      ))}
    </DataTable>
  )
}
