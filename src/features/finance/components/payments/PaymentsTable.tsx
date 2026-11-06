import { Undo2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters'
import { PAYMENT_STATUS, type PaymentResponse } from '../../types/financeTypes'
import { CELL_CLASS, DataTable, type TableColumn } from '@/components/ui/DataTable'

interface PaymentsTableProps {
  payments: PaymentResponse[]
  onVoid: (payment: PaymentResponse) => void
}

export function PaymentsTable({ payments, onVoid }: PaymentsTableProps) {
  const { t } = useTranslation()
  const labels = t.finance.columns

  const columns: TableColumn[] = [
    { key: 'receipt', label: labels.receipt },
    { key: 'student', label: labels.student },
    { key: 'method', label: labels.method },
    { key: 'account', label: labels.account },
    { key: 'group', label: labels.group },
    { key: 'status', label: labels.status },
    { key: 'amount', label: labels.amount, align: 'right' },
    { key: 'balance', label: labels.balanceAfter, align: 'right' },
    { key: 'actions', label: labels.actions, align: 'right' },
  ]

  return (
    <DataTable columns={columns}>
      {payments.map((payment) => {
        const isVoided = payment.status === PAYMENT_STATUS.Voided
        return (
          <tr key={payment.id} className="hover:bg-surface-tint transition-colors">
            <td className={CELL_CLASS}>
              <div className="font-mono text-2xs text-heading truncate max-w-40">{payment.receiptNumber}</div>
              <div className="text-2xs text-caption tabular-nums">
                {formatDate(payment.paymentDate)} · {formatTime(payment.paymentDate)}
              </div>
            </td>
            <td className={`${CELL_CLASS} font-semibold text-heading`}>{payment.studentName}</td>
            <td className={CELL_CLASS}>
              <Badge variant="accent">{t.finance.paymentMethods[payment.paymentMethod]}</Badge>
            </td>
            <td className={`${CELL_CLASS} text-copy`}>{payment.cashAccountName}</td>
            <td className={`${CELL_CLASS} text-copy`}>{payment.groupName ?? '—'}</td>
            <td className={CELL_CLASS}>
              <Badge variant={isVoided ? 'danger' : 'success'}>{t.finance.paymentStatuses[payment.status]}</Badge>
            </td>
            <td
              className={cn(
                CELL_CLASS,
                'text-right font-bold tabular-nums',
                isVoided ? 'text-caption line-through' : 'text-success-ink'
              )}
            >
              {formatCurrency(payment.amount)}
            </td>
            <td className={`${CELL_CLASS} text-right text-copy tabular-nums`}>
              {formatCurrency(payment.studentBalanceAfter)}
            </td>
            <td className={`${CELL_CLASS} text-right`}>
              {!isVoided && (
                <PermissionGuard permission={PERMISSIONS.FINANCE.REFUND}>
                  <button
                    type="button"
                    onClick={() => onVoid(payment)}
                    title={t.finance.voidPayment.action}
                    aria-label={t.finance.voidPayment.action}
                    className="p-1 rounded text-caption hover:text-debt-ink hover:bg-debt-soft transition-colors"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                </PermissionGuard>
              )}
            </td>
          </tr>
        )
      })}
    </DataTable>
  )
}
