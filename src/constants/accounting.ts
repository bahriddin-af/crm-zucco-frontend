/** Backend `Constants.Accounting` bilan mos. */
export const ACCOUNTING = {
  DECIMAL_PLACES: 2,
  /** Backend: 9999999999999999.99 — JS double'da aniq ifodalanadigan eng yaqin pastki qiymat. */
  MAXIMUM_AMOUNT: 9_999_999_999_999_998,
  PERCENTAGE_SCALE: 100,
} as const
