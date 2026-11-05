import { z } from 'zod'
import type { Translations } from '@/i18n'
import { ISSUABLE_COIN_REASONS } from './marketTypes'

/** Backend `MarketItem.Create/Update`: Guard.Text(name), Guard.Positive(price), Guard.NonNegative(stock). */
export const createMarketItemSchema = (t: Translations) =>
  z.object({
    name: z.string().trim().min(1, t.market.validation.nameRequired),
    priceInCoins: z
      .number({ error: t.market.validation.pricePositive })
      .int(t.market.validation.pricePositive)
      .positive(t.market.validation.pricePositive),
    stockQuantity: z
      .number({ error: t.market.validation.stockNonNegative })
      .int(t.market.validation.stockNonNegative)
      .nonnegative(t.market.validation.stockNonNegative),
    description: z.string().trim(),
    imageUrl: z.string().trim(),
    isActive: z.boolean(),
  })

export type MarketItemFormValues = z.infer<ReturnType<typeof createMarketItemSchema>>

/** Backend `PurchaseMarketItemRequest`: StudentId majburiy. */
export const createPurchaseSchema = (t: Translations) =>
  z.object({
    studentId: z.string().min(1, t.coins.validation.studentRequired),
  })

export type PurchaseFormValues = z.infer<ReturnType<typeof createPurchaseSchema>>

/** Backend `IssueCoinsAsync`: Amount != 0 (manfiy — kamaytirish), Reason enum'da bo'lishi shart. */
export const createIssueCoinsSchema = (t: Translations) =>
  z.object({
    studentId: z.string().min(1, t.coins.validation.studentRequired),
    amount: z
      .number({ error: t.coins.validation.amountInteger })
      .int(t.coins.validation.amountInteger)
      .refine((value) => value !== 0, t.coins.validation.amountNonZero),
    reason: z.literal(ISSUABLE_COIN_REASONS, { error: t.coins.validation.reasonRequired }),
    description: z.string().trim(),
  })

export type IssueCoinsFormValues = z.infer<ReturnType<typeof createIssueCoinsSchema>>
