import { useMemo, useState, type KeyboardEvent } from 'react'
import { z } from 'zod'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { MAX_SCORE } from '../types/attendanceTypes'

interface ScoreInputProps {
  value?: number | null
  disabled: boolean
  label: string
  onCommit: (score: number | null) => void
}

/**
 * Baho katakchasi: blur yoki Enter'da Zod bilan tekshirib, o'zgargan bo'lsagina yuboradi.
 * Boshqarilmaydigan input `key` orqali server qiymati o'zgarganda qayta o'rnatiladi (effect'siz).
 */
export function ScoreInput({ value, disabled, label, onCommit }: ScoreInputProps) {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const schema = useMemo(
    () => z.number().int(t.attendance.scoreInvalid).min(0, t.attendance.scoreInvalid).max(MAX_SCORE, t.attendance.scoreInvalid),
    [t]
  )

  const commit = (raw: string) => {
    const trimmed = raw.trim()
    if (trimmed === '') {
      setError(null)
      if (value != null) onCommit(null)
      return
    }
    const parsed = schema.safeParse(Number(trimmed))
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t.attendance.scoreInvalid)
      return
    }
    setError(null)
    if (parsed.data !== value) onCommit(parsed.data)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') event.currentTarget.blur()
  }

  return (
    <div>
      <input
        key={value ?? 'empty'}
        type="number"
        inputMode="numeric"
        min={0}
        max={MAX_SCORE}
        aria-label={label}
        aria-invalid={error !== null}
        defaultValue={value ?? ''}
        disabled={disabled}
        onBlur={(event) => commit(event.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-16 h-8 text-center rounded border bg-canvas font-bold text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60',
          error ? 'border-debt' : 'border-border'
        )}
      />
      {error && <p className="mt-1 text-3xs text-debt-ink max-w-[140px]">{error}</p>}
    </div>
  )
}
