import { AlertCircle, ArrowDownRight, ArrowUpRight, Percent, TrendingUp, UserPlus } from 'lucide-react'
import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency } from '@/utils/formatters'
import { StatCard } from '@/components/ui/StatCard'
import type { MonthlyReportResponse } from '../types/reportTypes'
import { percentChange } from '../utils/reportMath'
import { formatPercent } from '@/utils/formatters'

export function ReportsKpiGrid({ report }: { report: MonthlyReportResponse }) {
  const { t } = useTranslation()
  const messages = t.reports
  const change = percentChange(report.netProfit, report.previousNetProfit)
  const changeLabel =
    change === null
      ? messages.noPrevious
      : interpolate(messages.changeVsPrevious, { value: formatPercent(change, true) })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        label={messages.revenue}
        value={formatCurrency(report.revenue)}
        icon={<ArrowUpRight className="w-4 h-4" />}
        tone="positive"
      />
      <StatCard
        label={messages.expenses}
        value={formatCurrency(report.expenses)}
        icon={<ArrowDownRight className="w-4 h-4" />}
        tone="negative"
      />
      <StatCard
        label={messages.netProfit}
        value={formatCurrency(report.netProfit)}
        icon={<TrendingUp className="w-4 h-4" />}
        tone={report.netProfit < 0 ? 'negative' : 'positive'}
        hint={changeLabel}
      />
      <StatCard
        label={messages.newStudents}
        value={String(report.newStudents)}
        icon={<UserPlus className="w-4 h-4" />}
      />
      <StatCard
        label={messages.conversion}
        value={formatPercent(report.conversionRatePercent)}
        icon={<Percent className="w-4 h-4" />}
        hint={interpolate(messages.conversionHint, {
          converted: report.convertedLeads,
          leads: report.newLeads,
        })}
      />
      <StatCard
        label={messages.totalDebt}
        value={formatCurrency(report.totalDebt)}
        icon={<AlertCircle className="w-4 h-4" />}
        tone="warning"
        hint={interpolate(messages.debtors, { count: report.debtorsCount })}
      />
    </div>
  )
}
