import { getTranslations } from '@/i18n'
import { SALARY_CALCULATION_TYPE } from '../types/payrollTypes'
import {
  createCalculateSalarySchema,
  createPaySalarySchema,
  createSalarySchemeSchema,
  toUpsertSalarySchemeRequest,
} from './payrollSchemas'

const t = getTranslations('en')
const messages = t.payroll.validation

const validScheme = {
  teacherId: 'teacher-1',
  groupId: '',
  calculationType: SALARY_CALCULATION_TYPE.PercentageOfRevenue,
  rateValue: 40,
  onlyPaidStudents: true,
  requireAttendanceMarked: true,
  isActive: true,
}

describe('createSalarySchemeSchema', () => {
  const schema = createSalarySchemeSchema(t)

  it('accepts a valid percentage scheme', () => {
    expect(schema.safeParse(validScheme).success).toBe(true)
  })

  it('caps percentage schemes at PercentageScale like the backend', () => {
    const result = schema.safeParse({ ...validScheme, rateValue: 101 })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]).toMatchObject({ message: messages.percentMax, path: ['rateValue'] })
  })

  it('allows large amounts for non-percentage schemes but never negative rates', () => {
    const fixed = { ...validScheme, calculationType: SALARY_CALCULATION_TYPE.FixedMonthlySalary }
    expect(schema.safeParse({ ...fixed, rateValue: 6_000_000 }).success).toBe(true)
    expect(schema.safeParse({ ...fixed, rateValue: -1 }).error?.issues[0]?.message).toBe(messages.nonNegative)
  })

  it('requires a teacher and a defined calculation type', () => {
    expect(schema.safeParse({ ...validScheme, teacherId: '' }).success).toBe(false)
    expect(schema.safeParse({ ...validScheme, calculationType: 7 }).success).toBe(false)
  })

  it('maps the group to null for teacher-wide schemes', () => {
    expect(toUpsertSalarySchemeRequest(validScheme, 'scheme-1')).toMatchObject({ id: 'scheme-1', groupId: null })
    expect(toUpsertSalarySchemeRequest(validScheme)).toMatchObject({ id: null })
  })
})

describe('createCalculateSalarySchema', () => {
  const schema = createCalculateSalarySchema(t)
  const valid = { teacherId: 'teacher-1', period: '2026-11', bonus: 0, deduction: 0 }

  it('requires a yyyy-MM period', () => {
    expect(schema.safeParse(valid).success).toBe(true)
    expect(schema.safeParse({ ...valid, period: '2026-1' }).error?.issues[0]?.message).toBe(messages.periodFormat)
  })

  it('rejects negative bonus or deduction', () => {
    expect(schema.safeParse({ ...valid, bonus: -10 }).success).toBe(false)
    expect(schema.safeParse({ ...valid, deduction: -10 }).success).toBe(false)
  })
})

describe('createPaySalarySchema', () => {
  it('requires a cash account and keeps the expense category optional', () => {
    const schema = createPaySalarySchema(t)
    expect(schema.safeParse({ cashAccountId: '', expenseCategoryId: '' }).success).toBe(false)
    expect(schema.safeParse({ cashAccountId: 'account-1', expenseCategoryId: '' }).success).toBe(true)
  })
})
