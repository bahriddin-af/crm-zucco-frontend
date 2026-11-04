export const PAYMENT_METHODS = {
  CASH: 'Cash',
  CARD: 'Card',
  CLICK: 'Click',
  PAYME: 'Payme',
  BANK_TRANSFER: 'BankTransfer',
  OTHER: 'Other',
} as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS]

export interface CashAccount {
  id: string
  name: string
  balance: number
  currency: string
  isDefault?: boolean
}

export interface PaymentTransaction {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  accountId: string
  accountName: string
  amount: number
  method: PaymentMethod
  billingPeriod?: string
  groupName?: string
  comment?: string
  createdAt: string
  receiptNumber?: string
}

export interface ExpenseTransaction {
  id: string
  accountId: string
  accountName: string
  categoryId: string
  categoryName: string
  amount: number
  recipient?: string
  comment?: string
  createdAt: string
}

export interface CreatePaymentRequest {
  studentId: string
  accountId: string
  amount: number
  method: PaymentMethod
  groupId?: string
  billingPeriod?: string
  comment?: string
  printReceipt?: boolean
}

export interface CreateExpenseRequest {
  accountId: string
  categoryId: string
  amount: number
  recipient?: string
  comment: string
}
