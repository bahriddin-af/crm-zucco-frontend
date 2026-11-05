/**
 * Inline style ishlatilmaydi: dinamik o'lchamlar oldindan belgilangan Tailwind klass shkalasidan tanlanadi.
 * Klasslar to'liq yozilgan — Tailwind ularni manba kodidan topishi uchun.
 */
const WIDTH_SCALE = [
  'w-0',
  'w-1/12',
  'w-2/12',
  'w-3/12',
  'w-4/12',
  'w-5/12',
  'w-6/12',
  'w-7/12',
  'w-8/12',
  'w-9/12',
  'w-10/12',
  'w-11/12',
  'w-full',
] as const

const HEIGHT_SCALE = ['h-0', 'h-4', 'h-8', 'h-12', 'h-16', 'h-20', 'h-24', 'h-28', 'h-32', 'h-36', 'h-40'] as const

const PERCENT_SCALE = 100

function pickFromScale<T>(scale: readonly T[], value: number, max: number): T {
  if (max <= 0 || value <= 0) return scale[0]
  const ratio = Math.min(value / max, 1)
  // Nol bo'lmagan qiymat hech qachon ko'rinmas bo'lib qolmasligi uchun kamida 1-qadam.
  const index = Math.max(1, Math.round(ratio * (scale.length - 1)))
  return scale[index]
}

/** `value / max` nisbatiga mos kenglik klassi (`w-0` … `w-full`). */
export function widthClass(value: number, max: number): string {
  return pickFromScale(WIDTH_SCALE, value, max)
}

/** `value / max` nisbatiga mos balandlik klassi (`h-0` … `h-40`). */
export function heightClass(value: number, max: number): string {
  return pickFromScale(HEIGHT_SCALE, value, max)
}

/** O'tgan oyga nisbatan o'zgarish foizi; o'tgan qiymat 0 bo'lsa solishtirib bo'lmaydi (`null`). */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return ((current - previous) / Math.abs(previous)) * PERCENT_SCALE
}

