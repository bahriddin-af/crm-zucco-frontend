import type { PaymentMethod } from '@/features/finance/types/financeTypes'

/** Backend `PaymentMethodTotal`. */
export interface PaymentMethodTotal {
  method: PaymentMethod
  amount: number
}

/** Backend `ExpenseCategoryTotal`. */
export interface ExpenseCategoryTotal {
  categoryId: string
  categoryName: string
  amount: number
}

/** Backend `ReportTrendPoint` (`period` — `yyyy-MM`). */
export interface ReportTrendPoint {
  period: string
  revenue: number
  expenses: number
}

/** Backend `MonthlyReportResponse`. */
export interface MonthlyReportResponse {
  period: string
  revenue: number
  expenses: number
  netProfit: number
  previousNetProfit: number
  newStudents: number
  newLeads: number
  convertedLeads: number
  conversionRatePercent: number
  totalDebt: number
  debtorsCount: number
  revenueByMethod: PaymentMethodTotal[]
  expensesByCategory: ExpenseCategoryTotal[]
  trend: ReportTrendPoint[]
}
