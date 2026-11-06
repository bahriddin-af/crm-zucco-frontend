/** Backend `Zucco.Domain.Finance.Enums.CashAccountType` (JSON: raqam). */
export const CASH_ACCOUNT_TYPE = {
  Cash: 1,
  BankAccount: 2,
  Terminal: 3,
  OnlineAggregator: 4,
} as const

export type CashAccountType = (typeof CASH_ACCOUNT_TYPE)[keyof typeof CASH_ACCOUNT_TYPE]
export const CASH_ACCOUNT_TYPE_VALUES = Object.values(CASH_ACCOUNT_TYPE)

/** Backend `Zucco.Domain.Finance.Enums.PaymentMethod` (JSON: raqam). */
export const PAYMENT_METHOD = {
  Cash: 1,
  Card: 2,
  BankTransfer: 3,
  Click: 4,
  Payme: 5,
  Uzum: 6,
} as const

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export const PAYMENT_METHODS: readonly PaymentMethod[] = Object.values(PAYMENT_METHOD)

/** EF konfiguratsiyasidagi `HasMaxLength` qiymatlari. */
export const FINANCE_TEXT_LIMITS = {
  PAYMENT_COMMENT: 500,
  PAYMENT_BILLING_PERIOD: 20,
  EXPENSE_DESCRIPTION: 500,
  EXPENSE_RECIPIENT: 150,
  /** Backend `CashAccountConfiguration.Name` — `HasMaxLength(150)`. */
  CASH_ACCOUNT_NAME: 150,
} as const

export const FINANCE_PAGE_SIZE = 20

export interface CashAccount {
  id: string
  name: string
  type: CashAccountType
  branchId?: string | null
  balance: number
  isDefault: boolean
}

/** Backend `CreateOrUpdateCashAccountRequest` (upsert: `id` bo'lsa tahrirlash). */
export interface CreateOrUpdateCashAccountRequest {
  id?: string | null
  name: string
  type: CashAccountType
  branchId?: string | null
  isDefault: boolean
}

export interface FinancialSummary {
  totalCashBalance: number
  totalPaymentsThisMonth: number
  totalExpensesThisMonth: number
  netProfitThisMonth: number
  totalStudentDebt: number
  totalDebtorsCount: number
  cashAccounts: CashAccount[]
}

/** Backend `RecordPaymentRequest`. */
export interface RecordPaymentRequest {
  studentId: string
  cashAccountId: string
  amount: number
  paymentMethod: PaymentMethod
  groupId?: string | null
  comment?: string | null
  billingPeriod?: string | null
  operationId: string
}

export interface PaymentResponse {
  id: string
  studentId: string
  studentName: string
  cashAccountId: string
  cashAccountName: string
  groupId?: string | null
  groupName?: string | null
  amount: number
  paymentMethod: PaymentMethod
  receiptNumber: string
  paymentDate: string
  comment?: string | null
  studentBalanceAfter: number
}

/** Backend `RecordExpenseRequest`. */
export interface RecordExpenseRequest {
  cashAccountId: string
  expenseCategoryId: string
  amount: number
  description: string
  branchId?: string | null
  recipient?: string | null
  operationId: string
}

export interface ExpenseResponse {
  id: string
  cashAccountId: string
  cashAccountName: string
  expenseCategoryId: string
  expenseCategoryName: string
  amount: number
  description: string
  recipient?: string | null
  expenseDate: string
}

export interface ExpenseCategory {
  id: string
  name: string
}

type PagedFilters = {
  page: number
  pageSize: number
  search?: string
}

/** To'lovlar ro'yxati query parametrlari (`PagedRequest` + `FilterRequest` + filtrlar). */
export type PaymentsFilters = PagedFilters & {
  studentId?: string
  cashAccountId?: string
}

/** Xarajatlar ro'yxati query parametrlari (`PagedRequest` + `FilterRequest` + filtrlar). */
export type ExpensesFilters = PagedFilters & {
  expenseCategoryId?: string
  cashAccountId?: string
}
