export const CASH_ACCOUNT_TYPE = {
  Cash: 1,
  BankAccount: 2,
  Terminal: 3,
  OnlineAggregator: 4,
} as const

export type CashAccountType =
  (typeof CASH_ACCOUNT_TYPE)[keyof typeof CASH_ACCOUNT_TYPE]

export const CASH_ACCOUNT_TYPE_LABELS: Record<CashAccountType, string> = {
  [CASH_ACCOUNT_TYPE.Cash]: 'Нақд пул кассаси',
  [CASH_ACCOUNT_TYPE.BankAccount]: 'Банк ҳисоб рақами',
  [CASH_ACCOUNT_TYPE.Terminal]: 'Тўлов терминали (Uzcard/Humo)',
  [CASH_ACCOUNT_TYPE.OnlineAggregator]: 'Онлайн тўлов (Click/Payme)',
}

export const PAYMENT_METHOD = {
  Cash: 1,
  Card: 2,
  BankTransfer: 3,
  Click: 4,
  Payme: 5,
  Uzum: 6,
} as const

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PAYMENT_METHOD.Cash]: 'Нақд пул',
  [PAYMENT_METHOD.Card]: 'Пластик карта (Терминал)',
  [PAYMENT_METHOD.BankTransfer]: 'Банк ўтказмаси',
  [PAYMENT_METHOD.Click]: 'Click',
  [PAYMENT_METHOD.Payme]: 'Payme',
  [PAYMENT_METHOD.Uzum]: 'Uzum Bank',
}

export interface CashAccount {
  id: string
  name: string
  type: CashAccountType
  branchId?: string | null
  balance: number
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

export interface RecordPaymentRequest {
  studentId: string
  cashAccountId: string
  amount: number
  paymentMethod: PaymentMethod
  groupId?: string | null
  comment?: string | null
  billingPeriod?: string | null
  operationId?: string
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

export interface RecordExpenseRequest {
  cashAccountId: string
  expenseCategoryId?: string
  amount: number
  description: string
  branchId?: string | null
  recipient?: string | null
  operationId?: string
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
