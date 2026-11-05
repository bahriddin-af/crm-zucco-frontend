import { ACCOUNTING } from '@/constants/accounting'

/** `0.1 * 100 = 10.000000000000002` kabi suzuvchi nuqta shovqinini kesish uchun. */
const FLOAT_NOISE_DIGITS = 6

/** Pul qiymati backend `Guard.Money` talabiga mos (ko'pi bilan N kasr xona) ekanini tekshiradi. */
export function hasMoneyPrecision(value: number, decimalPlaces: number = ACCOUNTING.DECIMAL_PLACES): boolean {
  if (!Number.isFinite(value)) return false
  const scaled = Number((value * 10 ** decimalPlaces).toFixed(FLOAT_NOISE_DIGITS))
  return Number.isInteger(scaled)
}
