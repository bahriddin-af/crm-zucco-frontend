import { useTranslation } from '@/i18n'
import { describeRiskReason } from '../../utils/riskReasons'
import type { RiskReason, StudentRiskMetrics } from '../../types/studentRiskTypes'

interface RiskReasonListProps {
  reasons: RiskReason[]
  metrics: StudentRiskMetrics
}

/** Har bir sabab talabaning raqamlari bilan gap sifatida ("2 oylik qarz"). */
export function RiskReasonList({ reasons, metrics }: RiskReasonListProps) {
  const { t } = useTranslation()

  if (reasons.length === 0) return <span className="text-2xs text-caption">{t.risk.profile.noReasons}</span>

  return (
    <ul className="space-y-0.5 text-2xs text-copy-strong list-disc pl-4">
      {reasons.map((reason) => (
        <li key={reason}>{describeRiskReason(reason, metrics, t.risk)}</li>
      ))}
    </ul>
  )
}
