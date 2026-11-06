import { ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListState } from '@/components/ui/ListState'
import { SectionCard } from '@/components/ui/SectionCard'
import { interpolate, useTranslation } from '@/i18n'
import { formatDate } from '@/utils/formatters'
import { parseIsoDate } from '@/utils/dateUtils'
import { STUDENT_RISK_HISTORY_DAYS } from '../../constants/studentRiskConstants'
import { useStudentRiskHistory } from '../../hooks/useStudentRisk'
import { RiskLevelBadge } from './RiskLevelBadge'
import { RiskSparkline } from './RiskSparkline'

/** Talaba profilidagi xavf: oxirgi daraja, ball, sabablar va 30 kunlik grafik. */
export function StudentRiskCard({ studentId }: { studentId: string }) {
  const { t } = useTranslation()
  const text = t.risk.profile
  const historyQuery = useStudentRiskHistory(studentId, STUDENT_RISK_HISTORY_DAYS)
  const points = historyQuery.data ?? []
  const latest = points.at(-1)

  return (
    <SectionCard
      title={text.title}
      subtitle={interpolate(text.subtitle, { days: STUDENT_RISK_HISTORY_DAYS })}
      actions={latest && <RiskLevelBadge level={latest.level} />}
    >
      <ListState
        isLoading={historyQuery.isLoading}
        isError={historyQuery.isError}
        error={historyQuery.error}
        onRetry={() => void historyQuery.refetch()}
        isEmpty={!latest}
        empty={<EmptyState description={text.noHistory} icon={<ShieldCheck className="w-5 h-5" />} />}
      >
        {latest && (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-2xl font-bold tabular-nums text-heading">
                {interpolate(t.risk.scoreOutOf, { score: latest.score })}
              </span>
              <span className="text-2xs text-caption">
                {interpolate(t.risk.lastCalculated, { date: formatDate(parseIsoDate(latest.date)) })}
              </span>
            </div>
            <RiskSparkline
              points={points}
              label={interpolate(text.chartLabel, { days: STUDENT_RISK_HISTORY_DAYS })}
            />
            {latest.reasons.length === 0 ? (
              <p className="text-2xs text-caption">{text.noReasons}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {latest.reasons.map((reason) => (
                  <Badge key={reason}>{t.risk.reasonLabels[reason]}</Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </ListState>
    </SectionCard>
  )
}
