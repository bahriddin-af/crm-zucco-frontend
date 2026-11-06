import { z } from 'zod'
import { interpolate, type Translations } from '@/i18n'
import { hasMoneyPrecision } from '@/utils/money'
import { MONTH_PERIOD_PATTERN } from '@/utils/dateUtils'
import { ACCOUNTING } from '@/constants/accounting'
import {
  CASH_ACCOUNT_TYPE,
  CASH_ACCOUNT_TYPE_VALUES,
  FINANCE_TEXT_LIMITS,
  PAYMENT_METHODS,
  type CashAccount,
  type CreateOrUpdateCashAccountRequest,
  type RecordExpenseRequest,
  type RecordPaymentRequest,
} from '../types/financeTypes'

/** Backend `Guard.Positive(Guard.Money(...))` qoidasi: musbat, ko'pi bilan 2 kasr, maksimal summa. */
export function createPositiveMoneySchema(t: Translations) {
  const messages = t.finance.validation
  return z
    .number({ error: messages.amountRequired })
    .positive(messages.amountPositive)
    .max(ACCOUNTING.MAXIMUM_AMOUNT, messages.amountTooLarge)
    .refine((value) => hasMoneyPrecision(value, ACCOUNTING.DECIMAL_PLACES), messages.amountPrecision)
}

function maxText(t: Translations, max: number) {
  return z.string().max(max, interpolate(t.finance.validation.textTooLong, { max }))
}

const optionalText = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

/** Backend `RecordPaymentRequest` ga mos forma sxemasi (`operationId` formadan tashqarida). */
export function createPaymentSchema(t: Translations) {
  const messages = t.finance.validation
  return z.object({
    studentId: z.string().min(1, messages.studentRequired),
    cashAccountId: z.string().min(1, messages.cashAccountRequired),
    amount: createPositiveMoneySchema(t),
    paymentMethod: z.literal(PAYMENT_METHODS, { error: messages.methodRequired }),
    groupId: z.string(),
    billingPeriod: z
      .string()
      .max(FINANCE_TEXT_LIMITS.PAYMENT_BILLING_PERIOD)
      .refine((value) => value === '' || MONTH_PERIOD_PATTERN.test(value), messages.periodFormat),
    comment: maxText(t, FINANCE_TEXT_LIMITS.PAYMENT_COMMENT),
  })
}

export type PaymentFormValues = z.infer<ReturnType<typeof createPaymentSchema>>

/**
 * Forma qiymatlarini backend so'roviga aylantiradi. Matnlar trim qilinadi va bo'sh qiymatlar `null`
 * bo'ladi — backend idempotentlik tekshiruvi aynan shu ko'rinishdagi payloadni solishtiradi.
 */
export function toRecordPaymentRequest(
  values: PaymentFormValues,
  operationId: string
): RecordPaymentRequest {
  return {
    studentId: values.studentId,
    cashAccountId: values.cashAccountId,
    amount: values.amount,
    paymentMethod: values.paymentMethod,
    groupId: values.groupId || null,
    billingPeriod: optionalText(values.billingPeriod),
    comment: optionalText(values.comment),
    operationId,
  }
}

/** Backend `VoidPaymentRequest.Reason`: `Guard.Text` — bo'sh bo'lmagan, ko'pi bilan 500 belgi (trim qilinadi). */
export function createVoidPaymentSchema(t: Translations) {
  return z.object({
    reason: z
      .string()
      .trim()
      .min(1, t.finance.voidPayment.reasonRequired)
      .max(FINANCE_TEXT_LIMITS.PAYMENT_VOID_REASON, interpolate(t.finance.validation.textTooLong, { max: FINANCE_TEXT_LIMITS.PAYMENT_VOID_REASON })),
  })
}

export type VoidPaymentFormValues = z.infer<ReturnType<typeof createVoidPaymentSchema>>

/** Backend `RecordExpenseRequest` ga mos forma sxemasi. */
export function createExpenseSchema(t: Translations) {
  const messages = t.finance.validation
  return z.object({
    expenseCategoryId: z.string().min(1, t.expenses.validation.categoryRequired),
    cashAccountId: z.string().min(1, messages.cashAccountRequired),
    amount: createPositiveMoneySchema(t),
    description: maxText(t, FINANCE_TEXT_LIMITS.EXPENSE_DESCRIPTION).refine(
      (value) => value.trim().length > 0,
      t.expenses.validation.descriptionRequired
    ),
    recipient: maxText(t, FINANCE_TEXT_LIMITS.EXPENSE_RECIPIENT),
  })
}

export type ExpenseFormValues = z.infer<ReturnType<typeof createExpenseSchema>>

export function toRecordExpenseRequest(
  values: ExpenseFormValues,
  operationId: string
): RecordExpenseRequest {
  return {
    expenseCategoryId: values.expenseCategoryId,
    cashAccountId: values.cashAccountId,
    amount: values.amount,
    description: values.description.trim(),
    recipient: optionalText(values.recipient),
    operationId,
  }
}

/** Backend `CreateOrUpdateCashAccountRequest`: `Guard.Text` (bo'sh emas), `Guard.Defined` (tur). */
export function createCashAccountSchema(t: Translations) {
  return z.object({
    name: maxText(t, FINANCE_TEXT_LIMITS.CASH_ACCOUNT_NAME).refine(
      (value) => value.trim().length > 0,
      t.finance.accountForm.nameRequired
    ),
    type: z.literal(CASH_ACCOUNT_TYPE_VALUES, { error: t.groups.validation.optionInvalid }),
    branchId: z.string(),
    isDefault: z.boolean(),
  })
}

export type CashAccountFormValues = z.infer<ReturnType<typeof createCashAccountSchema>>

export function toCashAccountFormValues(account: CashAccount | null): CashAccountFormValues {
  return {
    name: account?.name ?? '',
    type: account?.type ?? CASH_ACCOUNT_TYPE.Cash,
    branchId: account?.branchId ?? '',
    isDefault: account?.isDefault ?? false,
  }
}

export function toCashAccountRequest(
  values: CashAccountFormValues,
  id: string | null
): CreateOrUpdateCashAccountRequest {
  return {
    id,
    name: values.name.trim(),
    type: values.type,
    branchId: values.branchId || null,
    isDefault: values.isDefault,
  }
}
