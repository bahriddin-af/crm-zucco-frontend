import type { StudentStatus } from './studentTypes'

/** Backend `Zucco.Domain.Students.Enums.RiskLevel` bilan 1:1 (JSON'da raqam). */
export const RISK_LEVEL = {
  Low: 1,
  Medium: 2,
  High: 3,
} as const

export type RiskLevel = (typeof RISK_LEVEL)[keyof typeof RISK_LEVEL]
export const RISK_LEVEL_VALUES: readonly RiskLevel[] = Object.values(RISK_LEVEL)

/** Backend `RiskReason` bilan 1:1 (JSON'da raqam). Qiymatlar barqaror — bazada saqlanadi. */
export const RISK_REASON = {
  FrequentAbsences: 1,
  AbsenceStreak: 2,
  FrequentLateness: 3,
  GradeDecline: 4,
  Debt: 5,
  HighDebt: 6,
  NoCoinActivity: 7,
  NotReturnedAfterFreeze: 8,
} as const

export type RiskReason = (typeof RISK_REASON)[keyof typeof RISK_REASON]

/** Backend `StudentRiskMetricsDto` — sabab matnidagi raqamlar shu yerdan olinadi. */
export interface StudentRiskMetrics {
  unexcusedAbsences: number
  lateArrivals: number
  absenceStreak: number
  /** Foizda (masalan `25` = 25%); baho yetarli bo'lmasa `null`. */
  gradeDropPercent: number | null
  /** Qarz necha oylik to'lovga teng; qarz bo'lmasa `null`. */
  debtMonths: number | null
  noRecentCoins: boolean
  daysSinceFreezeEnded: number | null
}

export interface StudentRiskItem {
  studentId: string
  fullName: string
  phone: string
  status: StudentStatus
  balance: number
  score: number
  level: RiskLevel
  reasons: RiskReason[]
  metrics: StudentRiskMetrics
  /** `yyyy-MM-dd` */
  snapshotDate: string
}

export interface StudentRiskSummary {
  /** Birinchi hisobdan oldin `null`. */
  snapshotDate: string | null
  total: number
  low: number
  medium: number
  high: number
}

export interface StudentRiskHistoryPoint {
  date: string
  score: number
  level: RiskLevel
  reasons: RiskReason[]
}

export interface StudentRiskRecalculationResult {
  snapshotDate: string
  evaluated: number
}

export interface StudentRiskFilters {
  page?: number
  pageSize?: number
  level?: RiskLevel
  branchId?: string
  groupId?: string
  search?: string
}
