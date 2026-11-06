import { RISK_LEVEL, type RiskLevel } from '../types/studentRiskTypes'

export const STUDENT_RISK_PAGE_SIZE = 20

/** Talaba profilidagi xavf grafigi necha kunni ko'rsatadi (backend 1–180 qabul qiladi). */
export const STUDENT_RISK_HISTORY_DAYS = 30

/** Ball shkalasi va daraja chegaralari — backend `Constants.ChurnRisk` bilan bir xil. */
export const RISK_SCORE = {
  MAX: 100,
  MEDIUM_MIN: 30,
  HIGH_MIN: 60,
} as const

/** Sabab matnlaridagi davrlar — backend `Constants.ChurnRisk` (RecentWindowDays, CoinInactivityDays). */
export const RISK_WINDOW_DAYS = {
  RECENT: 14,
  COINS: 30,
} as const

/** Bosh sahifa vidjetidan daraja bo'yicha filtrlangan ro'yxatga o'tish parametri. */
export const RISK_LEVEL_PARAM = 'level'

export const RISK_LEVEL_BADGE_VARIANT: Record<RiskLevel, 'success' | 'warning' | 'danger'> = {
  [RISK_LEVEL.Low]: 'success',
  [RISK_LEVEL.Medium]: 'warning',
  [RISK_LEVEL.High]: 'danger',
}

/** URL'dagi `?level=` qiymatini tekshiradi (noto'g'ri qiymat — filtrsiz). */
export function parseRiskLevel(value: string | null): RiskLevel | undefined {
  const level = Number(value)
  return Object.values(RISK_LEVEL).find((item) => item === level)
}
