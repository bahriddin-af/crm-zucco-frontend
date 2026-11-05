/** Backend `Zucco.Domain.Gamification.Enums.CoinReason` (JSON'da raqam). */
export const COIN_REASON = {
  Attendance: 1,
  HomeworkCompleted: 2,
  PerfectExamScore: 3,
  FriendReferral: 4,
  MarketPurchase: 5,
  ManualAdjustment: 6,
} as const

export type CoinReason = (typeof COIN_REASON)[keyof typeof COIN_REASON]

/** Qo'lda berish formasida tanlanadigan sabablar (`MarketPurchase` faqat xarid paytida tizim tomonidan yoziladi). */
export const ISSUABLE_COIN_REASONS = [
  COIN_REASON.Attendance,
  COIN_REASON.HomeworkCompleted,
  COIN_REASON.PerfectExamScore,
  COIN_REASON.FriendReferral,
  COIN_REASON.ManualAdjustment,
] as const

/** Backend `OrderStatus`. */
export const ORDER_STATUS = {
  Pending: 1,
  Delivered: 2,
  Cancelled: 3,
} as const

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

export const MARKET_PAGE_SIZE = 20

export interface MarketItem {
  id: string
  name: string
  description: string | null
  priceInCoins: number
  stockQuantity: number
  imageUrl: string | null
  isActive: boolean
}

export interface CreateOrUpdateMarketItemRequest {
  id: string | null
  name: string
  priceInCoins: number
  stockQuantity: number
  description: string | null
  imageUrl: string | null
  isActive: boolean
}

export interface PurchaseMarketItemRequest {
  studentId: string
  marketItemId: string
  operationId: string
}

export interface MarketOrder {
  id: string
  studentId: string
  studentName: string
  marketItemId: string
  itemName: string
  priceInCoins: number
  status: OrderStatus
  orderedAt: string
  deliveredAt: string | null
}

export interface OrdersFilter {
  page: number
  pageSize: number
  status?: OrderStatus
}

export interface CoinTransaction {
  id: string
  studentId: string
  studentName: string
  amount: number
  balanceAfter: number
  reason: CoinReason
  description: string | null
  createdAt: string
}

export interface CoinTransactionsFilter {
  page: number
  pageSize: number
  search?: string
  reason?: CoinReason
  studentId?: string
}

export interface IssueCoinsRequest {
  studentId: string
  amount: number
  reason: CoinReason
  description: string | null
  operationId: string
}
