import { interpolate, type Translations } from '@/i18n'
import { formatDecimal, formatPercent } from '@/utils/formatters'
import { RISK_WINDOW_DAYS } from '../constants/studentRiskConstants'
import { RISK_REASON, type RiskReason, type StudentRiskMetrics } from '../types/studentRiskTypes'

type RiskText = Translations['risk']

/** Sabab matnidagi o'rinbosarlar; kerakli ko'rsatkich `null` bo'lsa — qisqa nom ishlatiladi. */
function reasonValues(reason: RiskReason, metrics: StudentRiskMetrics): Record<string, string | number> | null {
  switch (reason) {
    case RISK_REASON.FrequentAbsences:
      return { count: metrics.unexcusedAbsences, days: RISK_WINDOW_DAYS.RECENT }
    case RISK_REASON.AbsenceStreak:
      return { count: metrics.absenceStreak }
    case RISK_REASON.FrequentLateness:
      return { count: metrics.lateArrivals, days: RISK_WINDOW_DAYS.RECENT }
    case RISK_REASON.GradeDecline:
      return metrics.gradeDropPercent === null ? null : { percent: formatPercent(metrics.gradeDropPercent) }
    case RISK_REASON.Debt:
    case RISK_REASON.HighDebt:
      return metrics.debtMonths === null ? null : { months: formatDecimal(metrics.debtMonths) }
    case RISK_REASON.NoCoinActivity:
      return { days: RISK_WINDOW_DAYS.COINS }
    case RISK_REASON.NotReturnedAfterFreeze:
      return metrics.daysSinceFreezeEnded === null ? null : { days: metrics.daysSinceFreezeEnded }
  }
}

/** Sababni talabaning raqamlari bilan to'liq gapga aylantiradi ("3 ta dars sababsiz qoldirildi"). */
export function describeRiskReason(reason: RiskReason, metrics: StudentRiskMetrics, text: RiskText): string {
  const values = reasonValues(reason, metrics)
  return values ? interpolate(text.reasons[reason], values) : text.reasonLabels[reason]
}
