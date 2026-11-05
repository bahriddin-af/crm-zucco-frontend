/** Backend `Zucco.Domain.Payroll.Enums.SalaryCalculationType` (JSON: raqam). */
export const SALARY_CALCULATION_TYPE = {
  PercentageOfRevenue: 1,
  FixedPerStudent: 2,
  PerLessonRate: 3,
  FixedMonthlySalary: 4,
} as const

export type SalaryCalculationType =
  (typeof SALARY_CALCULATION_TYPE)[keyof typeof SALARY_CALCULATION_TYPE]

export const SALARY_CALCULATION_TYPES: readonly SalaryCalculationType[] =
  Object.values(SALARY_CALCULATION_TYPE)

/** Backend `Zucco.Domain.Payroll.Enums.SalaryStatus` (JSON: raqam). */
export const SALARY_STATUS = {
  Pending: 1,
  Approved: 2,
  Paid: 3,
} as const

export type SalaryStatus = (typeof SALARY_STATUS)[keyof typeof SALARY_STATUS]

/** Backend `UpsertSalarySchemeRequest`. */
export interface UpsertSalarySchemeRequest {
  id?: string | null
  teacherId: string
  calculationType: SalaryCalculationType
  rateValue: number
  groupId?: string | null
  onlyPaidStudents: boolean
  requireAttendanceMarked: boolean
  isActive: boolean
}

export interface SalarySchemeResponse {
  id: string
  teacherId: string
  teacherName: string
  groupId?: string | null
  groupName?: string | null
  calculationType: SalaryCalculationType
  rateValue: number
  onlyPaidStudents: boolean
  requireAttendanceMarked: boolean
  isActive: boolean
}

/** Backend `CalculateTeacherSalaryRequest`. `period` — `yyyy-MM`. */
export interface CalculateTeacherSalaryRequest {
  teacherId: string
  period: string
  bonus: number
  deduction: number
}

export interface SalaryCalculationResponse {
  id: string
  teacherId: string
  teacherName: string
  period: string
  totalLessonsTaught: number
  totalActiveStudents: number
  totalRevenueGenerated: number
  calculatedAmount: number
  bonus: number
  deduction: number
  finalAmount: number
  paidAmount: number
  status: SalaryStatus
  calculatedAt: string
  paidAt?: string | null
}

/**
 * Backend `PaySalaryRequest`. `salaryCalculationId` URL'dan ham olinadi; `amount` hisobning
 * `finalAmount` qiymatiga teng bo'lishi shart. Idempotentlik backendda hisob ID orqali ta'minlanadi.
 */
export interface PaySalaryRequest {
  salaryCalculationId: string
  cashAccountId: string
  amount: number
  expenseCategoryId?: string | null
}

export type PayrollFilters = {
  teacherId?: string
  period?: string
}
