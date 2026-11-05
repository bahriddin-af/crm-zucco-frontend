import { z } from 'zod'
import type { Translations } from '@/i18n'
import { hasMoneyPrecision } from '@/utils/money'
import { MONTH_PERIOD_PATTERN } from '@/utils/dateUtils'
import { ACCOUNTING } from '@/constants/accounting'
import {
  SALARY_CALCULATION_TYPE,
  SALARY_CALCULATION_TYPES,
  type CalculateTeacherSalaryRequest,
  type UpsertSalarySchemeRequest,
} from '../types/payrollTypes'

/** Backend `Guard.NonNegative(Guard.Money(...))`: manfiy emas, ko'pi bilan 2 kasr. */
function createNonNegativeMoneySchema(t: Translations) {
  const messages = t.payroll.validation
  return z
    .number({ error: messages.rateRequired })
    .min(0, messages.nonNegative)
    .max(ACCOUNTING.MAXIMUM_AMOUNT, messages.tooLarge)
    .refine((value) => hasMoneyPrecision(value, ACCOUNTING.DECIMAL_PLACES), messages.precision)
}

/** Backend `UpsertSalarySchemeRequest` + `PayrollService.UpsertSchemeAsync` qoidalari. */
export function createSalarySchemeSchema(t: Translations) {
  const messages = t.payroll.validation
  return z
    .object({
      teacherId: z.string().min(1, messages.teacherRequired),
      groupId: z.string(),
      calculationType: z.literal(SALARY_CALCULATION_TYPES, { error: messages.typeRequired }),
      rateValue: createNonNegativeMoneySchema(t),
      onlyPaidStudents: z.boolean(),
      requireAttendanceMarked: z.boolean(),
      isActive: z.boolean(),
    })
    .refine(
      (values) =>
        values.calculationType !== SALARY_CALCULATION_TYPE.PercentageOfRevenue ||
        values.rateValue <= ACCOUNTING.PERCENTAGE_SCALE,
      { message: messages.percentMax, path: ['rateValue'] }
    )
}

export type SalarySchemeFormValues = z.infer<ReturnType<typeof createSalarySchemeSchema>>

export function toUpsertSalarySchemeRequest(
  values: SalarySchemeFormValues,
  id?: string
): UpsertSalarySchemeRequest {
  return {
    id: id ?? null,
    teacherId: values.teacherId,
    groupId: values.groupId || null,
    calculationType: values.calculationType,
    rateValue: values.rateValue,
    onlyPaidStudents: values.onlyPaidStudents,
    requireAttendanceMarked: values.requireAttendanceMarked,
    isActive: values.isActive,
  }
}

/** Backend `CalculateTeacherSalaryRequest`: `period` — `yyyy-MM`, bonus/ushlab qolish manfiy emas. */
export function createCalculateSalarySchema(t: Translations) {
  const messages = t.payroll.validation
  return z.object({
    teacherId: z.string().min(1, messages.teacherRequired),
    period: z.string().regex(MONTH_PERIOD_PATTERN, messages.periodFormat),
    bonus: createNonNegativeMoneySchema(t),
    deduction: createNonNegativeMoneySchema(t),
  })
}

export type CalculateSalaryFormValues = z.infer<ReturnType<typeof createCalculateSalarySchema>>

export function toCalculateSalaryRequest(values: CalculateSalaryFormValues): CalculateTeacherSalaryRequest {
  return { ...values }
}

/** Backend `PaySalaryRequest`: summa hisobdan olinadi, foydalanuvchi kassa va toifani tanlaydi. */
export function createPaySalarySchema(t: Translations) {
  return z.object({
    cashAccountId: z.string().min(1, t.payroll.validation.cashAccountRequired),
    expenseCategoryId: z.string(),
  })
}

export type PaySalaryFormValues = z.infer<ReturnType<typeof createPaySalarySchema>>
