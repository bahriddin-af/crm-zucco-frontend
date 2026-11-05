import { Pencil } from 'lucide-react'
import { PermissionGuard } from '@/components/common/PermissionGuard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PERMISSIONS } from '@/constants/permissions'
import { useTranslation } from '@/i18n'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import {
  SALARY_CALCULATION_TYPE,
  type SalarySchemeResponse,
} from '../../types/payrollTypes'
import { CELL_CLASS, DataTable, type TableColumn } from '@/components/ui/DataTable'

interface SalarySchemesTableProps {
  schemes: SalarySchemeResponse[]
  onEdit: (scheme: SalarySchemeResponse) => void
}

export function SalarySchemesTable({ schemes, onEdit }: SalarySchemesTableProps) {
  const { t } = useTranslation()
  const messages = t.payroll.schemes
  const columns: TableColumn[] = [
    { key: 'teacher', label: t.payroll.teacher },
    { key: 'group', label: messages.group },
    { key: 'type', label: messages.calculationType },
    { key: 'rate', label: messages.rateValue, align: 'right' },
    { key: 'options', label: messages.options },
    { key: 'status', label: t.common.status },
    { key: 'actions', label: t.common.actions, align: 'right' },
  ]

  return (
    <DataTable columns={columns}>
      {schemes.map((scheme) => (
        <tr key={scheme.id} className="hover:bg-surface-tint transition-colors">
          <td className={`${CELL_CLASS} font-semibold text-heading`}>{scheme.teacherName}</td>
          <td className={`${CELL_CLASS} text-copy`}>{scheme.groupName ?? messages.allGroups}</td>
          <td className={CELL_CLASS}>
            <Badge variant="accent">{t.payroll.calculationTypes[scheme.calculationType]}</Badge>
          </td>
          <td className={`${CELL_CLASS} text-right font-bold text-heading tabular-nums`}>
            {scheme.calculationType === SALARY_CALCULATION_TYPE.PercentageOfRevenue
              ? formatPercent(scheme.rateValue)
              : formatCurrency(scheme.rateValue)}
          </td>
          <td className={`${CELL_CLASS} text-2xs text-caption`}>
            {scheme.onlyPaidStudents && <div>{messages.onlyPaidStudents}</div>}
            {scheme.requireAttendanceMarked && <div>{messages.requireAttendanceMarked}</div>}
          </td>
          <td className={CELL_CLASS}>
            <Badge variant={scheme.isActive ? 'success' : 'default'}>
              {scheme.isActive ? messages.active : messages.inactive}
            </Badge>
          </td>
          <td className={`${CELL_CLASS} text-right`}>
            <PermissionGuard permission={PERMISSIONS.PAYROLL.CALCULATE}>
              <Button variant="ghost" size="icon" onClick={() => onEdit(scheme)} aria-label={t.common.edit}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            </PermissionGuard>
          </td>
        </tr>
      ))}
    </DataTable>
  )
}
