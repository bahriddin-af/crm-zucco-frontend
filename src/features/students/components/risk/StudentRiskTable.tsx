import { Link, generatePath } from 'react-router-dom'
import { CELL_CLASS, DataTable, type TableColumn } from '@/components/ui/DataTable'
import { ROUTES } from '@/routes/paths'
import { useTranslation } from '@/i18n'
import { formatCurrency, formatPhone } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import type { StudentRiskItem } from '../../types/studentRiskTypes'
import { RiskLevelBadge } from './RiskLevelBadge'
import { RiskReasonList } from './RiskReasonList'

/** Xavf ostidagi talabalar (backend balli kamayish tartibida qaytaradi). */
export function StudentRiskTable({ items }: { items: StudentRiskItem[] }) {
  const { t } = useTranslation()
  const text = t.risk.columns

  const columns: TableColumn[] = [
    { key: 'student', label: text.student },
    { key: 'score', label: text.score, align: 'right' },
    { key: 'level', label: text.level },
    { key: 'reasons', label: text.reasons },
    { key: 'balance', label: text.balance, align: 'right' },
  ]

  return (
    <div className="bg-surface rounded-lg border border-border shadow-xs overflow-hidden">
      <DataTable columns={columns}>
        {items.map((item) => (
          <tr key={item.studentId} className="hover:bg-surface-muted transition-colors align-top">
            <td className={CELL_CLASS}>
              <Link
                to={generatePath(ROUTES.STUDENTS.DETAIL, { id: item.studentId })}
                className="font-bold text-heading hover:text-primary transition-colors"
              >
                {item.fullName}
              </Link>
              <p className="text-2xs text-caption tabular-nums">{formatPhone(item.phone)}</p>
            </td>
            <td className={cn(CELL_CLASS, 'text-right font-semibold tabular-nums text-heading')}>{item.score}</td>
            <td className={CELL_CLASS}>
              <RiskLevelBadge level={item.level} />
            </td>
            <td className={CELL_CLASS}>
              <RiskReasonList reasons={item.reasons} metrics={item.metrics} />
            </td>
            <td
              className={cn(
                CELL_CLASS,
                'text-right font-semibold tabular-nums',
                item.balance < 0 ? 'text-debt-ink' : 'text-success-ink'
              )}
            >
              {formatCurrency(item.balance)}
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  )
}
