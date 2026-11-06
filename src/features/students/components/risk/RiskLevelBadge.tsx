import { Badge } from '@/components/ui/Badge'
import { useTranslation } from '@/i18n'
import { RISK_LEVEL_BADGE_VARIANT } from '../../constants/studentRiskConstants'
import type { RiskLevel } from '../../types/studentRiskTypes'

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const { t } = useTranslation()
  return <Badge variant={RISK_LEVEL_BADGE_VARIANT[level]}>{t.risk.levels[level]}</Badge>
}
