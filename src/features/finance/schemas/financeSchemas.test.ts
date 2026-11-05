import { getTranslations } from '@/i18n'
import { PAYMENT_METHOD } from '../types/financeTypes'
import {
  createExpenseSchema,
  createPaymentSchema,
  toRecordExpenseRequest,
  toRecordPaymentRequest,
  type PaymentFormValues,
} from './financeSchemas'

const t = getTranslations('en')
const validPayment: PaymentFormValues = {
  studentId: 'student-1',
  cashAccountId: 'account-1',
  amount: 500000,
  paymentMethod: PAYMENT_METHOD.Card,
  groupId: '',
  billingPeriod: '2026-11',
  comment: '',
}

const firstMessage = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.error?.issues[0]?.message

describe('createPaymentSchema', () => {
  const schema = createPaymentSchema(t)

  it('accepts a payload that mirrors RecordPaymentRequest', () => {
    expect(schema.safeParse(validPayment).success).toBe(true)
  })

  it('requires a student and a cash account', () => {
    expect(firstMessage(schema.safeParse({ ...validPayment, studentId: '' }))).toBe(
      t.finance.validation.studentRequired
    )
    expect(firstMessage(schema.safeParse({ ...validPayment, cashAccountId: '' }))).toBe(
      t.finance.validation.cashAccountRequired
    )
  })

  it.each([
    [0, t.finance.validation.amountPositive],
    [-5, t.finance.validation.amountPositive],
    [Number.NaN, t.finance.validation.amountRequired],
    [100.123, t.finance.validation.amountPrecision],
  ])('rejects amount %s like Guard.Positive(Guard.Money)', (amount, message) => {
    expect(firstMessage(schema.safeParse({ ...validPayment, amount }))).toBe(message)
  })

  it('accepts two decimal places despite float noise', () => {
    expect(schema.safeParse({ ...validPayment, amount: 0.1 + 0.2 }).success).toBe(true)
    expect(schema.safeParse({ ...validPayment, amount: 1500.55 }).success).toBe(true)
  })

  it('rejects unknown payment methods and malformed billing periods', () => {
    expect(schema.safeParse({ ...validPayment, paymentMethod: 9 }).success).toBe(false)
    expect(firstMessage(schema.safeParse({ ...validPayment, billingPeriod: '2026-13' }))).toBe(
      t.finance.validation.periodFormat
    )
    expect(schema.safeParse({ ...validPayment, billingPeriod: '' }).success).toBe(true)
  })

  it('limits the comment length to the database column size', () => {
    expect(schema.safeParse({ ...validPayment, comment: 'x'.repeat(501) }).success).toBe(false)
  })
})

describe('toRecordPaymentRequest', () => {
  it('trims text, nulls empty optionals and carries the operation id', () => {
    const request = toRecordPaymentRequest({ ...validPayment, comment: '  note  ', groupId: '' }, 'op-1')
    expect(request).toEqual({
      studentId: 'student-1',
      cashAccountId: 'account-1',
      amount: 500000,
      paymentMethod: PAYMENT_METHOD.Card,
      groupId: null,
      billingPeriod: '2026-11',
      comment: 'note',
      operationId: 'op-1',
    })
  })
})

describe('createExpenseSchema', () => {
  const schema = createExpenseSchema(t)
  const validExpense = {
    expenseCategoryId: 'category-1',
    cashAccountId: 'account-1',
    amount: 150000,
    description: 'Markers',
    recipient: '',
  }

  it('requires a category (backend ExpenseCategoryId is mandatory)', () => {
    expect(firstMessage(schema.safeParse({ ...validExpense, expenseCategoryId: '' }))).toBe(
      t.expenses.validation.categoryRequired
    )
  })

  it('rejects a blank description and over-long recipient', () => {
    expect(firstMessage(schema.safeParse({ ...validExpense, description: '   ' }))).toBe(
      t.expenses.validation.descriptionRequired
    )
    expect(schema.safeParse({ ...validExpense, recipient: 'x'.repeat(151) }).success).toBe(false)
  })

  it('maps to RecordExpenseRequest', () => {
    expect(toRecordExpenseRequest({ ...validExpense, description: ' Rent ' }, 'op-2')).toEqual({
      expenseCategoryId: 'category-1',
      cashAccountId: 'account-1',
      amount: 150000,
      description: 'Rent',
      recipient: null,
      operationId: 'op-2',
    })
  })
})
