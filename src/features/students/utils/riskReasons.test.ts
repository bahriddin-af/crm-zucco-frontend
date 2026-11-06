import { describeRiskReason } from './riskReasons'
import { riskMessages } from '@/i18n/messages/risk'
import { useLanguageStore } from '@/stores/languageStore'
import { RISK_REASON, type StudentRiskMetrics } from '../types/studentRiskTypes'

const text = riskMessages.en

const metrics: StudentRiskMetrics = {
  unexcusedAbsences: 3,
  lateArrivals: 4,
  absenceStreak: 3,
  gradeDropPercent: 25,
  debtMonths: 2,
  noRecentCoins: true,
  daysSinceFreezeEnded: 9,
}

describe('describeRiskReason', () => {
  beforeEach(() => useLanguageStore.getState().setLanguage('en'))

  it('fills each reason sentence with the student metrics', () => {
    expect(describeRiskReason(RISK_REASON.FrequentAbsences, metrics, text)).toBe('3 unexcused absences in the last 14 days')
    expect(describeRiskReason(RISK_REASON.AbsenceStreak, metrics, text)).toBe('3 unexcused absences in a row')
    expect(describeRiskReason(RISK_REASON.FrequentLateness, metrics, text)).toBe('Late 4 times in the last 14 days')
    expect(describeRiskReason(RISK_REASON.GradeDecline, metrics, text)).toBe('Average grade dropped by 25%')
    expect(describeRiskReason(RISK_REASON.HighDebt, metrics, text)).toBe('2 months of debt (high)')
    expect(describeRiskReason(RISK_REASON.NoCoinActivity, metrics, text)).toBe('No coins earned for 30 days')
    expect(describeRiskReason(RISK_REASON.NotReturnedAfterFreeze, metrics, text)).toBe(
      'Freeze ended 9 days ago, has not returned'
    )
  })

  it('formats fractional debt months', () => {
    expect(describeRiskReason(RISK_REASON.Debt, { ...metrics, debtMonths: 1.5 }, text)).toBe('1.5 months of debt')
  })

  it('falls back to the short label when the metric is missing', () => {
    const empty = { ...metrics, gradeDropPercent: null, debtMonths: null, daysSinceFreezeEnded: null }
    expect(describeRiskReason(RISK_REASON.GradeDecline, empty, text)).toBe(text.reasonLabels[RISK_REASON.GradeDecline])
    expect(describeRiskReason(RISK_REASON.Debt, empty, text)).toBe(text.reasonLabels[RISK_REASON.Debt])
    expect(describeRiskReason(RISK_REASON.NotReturnedAfterFreeze, empty, text)).toBe(
      text.reasonLabels[RISK_REASON.NotReturnedAfterFreeze]
    )
  })

  it('writes Uzbek sentences the way the design asks for', () => {
    expect(describeRiskReason(RISK_REASON.HighDebt, metrics, riskMessages.uz)).toBe('2 oylik qarz (yuqori)')
    expect(describeRiskReason(RISK_REASON.FrequentAbsences, metrics, riskMessages.uz)).toBe(
      'Oxirgi 14 kunda 3 ta dars sababsiz qoldirildi'
    )
  })
})
