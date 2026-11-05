import { Banknote, CheckCircle2 } from 'lucide-react'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { Badge, type BadgeProps } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PERMISSIONS } from '@/constants/permissions'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency, formatDate } from '@/utils/formatters'
import {
  SALARY_STATUS,
  type SalaryCalculationResponse,
  type SalaryStatus,
} from '../../types/payrollTypes'
import { CELL_CLASS, DataTable, type TableColumn } from '@/components/ui/DataTable'

const STATUS_VARIANT: Record<SalaryStatus, NonNullable<BadgeProps['variant']>> = {
  [SALARY_STATUS.Pending]: 'warning',
  [SALARY_STATUS.Approved]: 'accent',
  [SALARY_STATUS.Paid]: 'success',
}

interface SalaryCalculationsTableProps {
  calculations: SalaryCalculationResponse[]
  onApprove: (calculation: SalaryCalculationResponse) => void
  onPay: (calculation: SalaryCalculationResponse) => void
}

export function SalaryCalculationsTable({ calculations, onApprove, onPay }: SalaryCalculationsTableProps) {
  const { t } = useTranslation()
  const messages = t.payroll.calculations
  const labels = messages.columns

  const columns: TableColumn[] = [
    { key: 'teacher', label: labels.teacher },
    { key: 'period', label: labels.period },
    { key: 'workload', label: labels.workload },
    { key: 'revenue', label: labels.revenue, align: 'right' },
    { key: 'calculated', label: labels.calculatedAmount, align: 'right' },
    { key: 'adjustments', label: labels.adjustments, align: 'right' },
    { key: 'final', label: labels.finalAmount, align: 'right' },
    { key: 'status', label: labels.status },
    { key: 'actions', label: labels.actions, align: 'right' },
  ]

  return (
    <DataTable columns={columns}>
      {calculations.map((calculation) => (
        <tr key={calculation.id} className="hover:bg-surface-tint transition-colors">
          <td className={`${CELL_CLASS} font-semibold text-heading`}>{calculation.teacherName}</td>
          <td className={`${CELL_CLASS} text-copy tabular-nums`}>{calculation.period}</td>
          <td className={`${CELL_CLASS} text-copy whitespace-nowrap`}>
            {interpolate(messages.workload, {
              lessons: calculation.totalLessonsTaught,
              students: calculation.totalActiveStudents,
            })}
          </td>
          <td className={`${CELL_CLASS} text-right text-copy tabular-nums`}>
            {formatCurrency(calculation.totalRevenueGenerated)}
          </td>
          <td className={`${CELL_CLASS} text-right text-copy tabular-nums`}>
            {formatCurrency(calculation.calculatedAmount)}
          </td>
          <td className={`${CELL_CLASS} text-right text-caption tabular-nums whitespace-nowrap`}>
            {interpolate(messages.adjustments, {
              bonus: formatCurrency(calculation.bonus),
              deduction: formatCurrency(calculation.deduction),
            })}
          </td>
          <td className={`${CELL_CLASS} text-right font-bold text-heading tabular-nums`}>
            {formatCurrency(calculation.finalAmount)}
          </td>
          <td className={CELL_CLASS}>
            <Badge variant={STATUS_VARIANT[calculation.status]}>{t.payroll.statuses[calculation.status]}</Badge>
          </td>
          <td className={`${CELL_CLASS} text-right`}>
            {calculation.status === SALARY_STATUS.Pending && (
              <PermissionGuard permission={PERMISSIONS.PAYROLL.APPROVE}>
                <Button variant="outline" size="sm" onClick={() => onApprove(calculation)}>
                  {messages.approve}
                </Button>
              </PermissionGuard>
            )}
            {calculation.status === SALARY_STATUS.Approved && (
              <PermissionGuard permission={PERMISSIONS.PAYROLL.PAY}>
                <Button variant="primary" size="sm" onClick={() => onPay(calculation)}>
                  <Banknote className="w-3 h-3" />
                  <span>{messages.pay}</span>
                </Button>
              </PermissionGuard>
            )}
            {calculation.status === SALARY_STATUS.Paid && calculation.paidAt && (
              <span className="inline-flex items-center gap-1 text-2xs text-success-ink font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {interpolate(messages.paidAt, { date: formatDate(calculation.paidAt) })}
              </span>
            )}
          </td>
        </tr>
      ))}
    </DataTable>
  )
}
