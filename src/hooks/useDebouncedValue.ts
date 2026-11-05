import { useEffect, useState } from 'react'

/** Qidiruv maydonlari uchun standart kechikish (ms). */
export const SEARCH_DEBOUNCE_MS = 350

/** Qidiruv kabi tez o'zgaruvchi qiymatni serverga kechiktirib uzatish uchun. */
export function useDebouncedValue<T>(value: T, delayMs: number = SEARCH_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
