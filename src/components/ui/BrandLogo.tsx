import { useId } from 'react'
import { APP_VERSION } from '@/constants/app'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'

interface BrandMarkProps {
  className?: string
}

/**
 * Zucco belgisi: qatlam-qatlam turgan uchta doira — oy fazalari kabi eng ostkisining 50%,
 * o'rtadagisining 60%, eng ustkisining 100% qismi ko'rinadi (yangi o'quvchidan to'liq bilimgacha).
 * Masofalar (r=24): 0.808r va 0.984r — ko'rinish foizlari shundan hisoblangan.
 * Ranglar `--color-logo-*` token'laridan, shuning uchun tungi rejimda avtomatik ochroq bo'ladi.
 */
export function BrandMark({ className }: BrandMarkProps) {
  const id = useId()
  const bottomClip = `${id}-bottom`
  const middleClip = `${id}-middle`

  return (
    <svg viewBox="0 10 96 52" aria-hidden="true" className={cn('shrink-0', className)}>
      <defs>
        <clipPath id={bottomClip}>
          <circle cx="26" cy="36" r="24" />
        </clipPath>
        <clipPath id={middleClip}>
          <circle cx="45.39" cy="36" r="24" />
        </clipPath>
      </defs>
      <circle cx="26" cy="36" r="24" className="fill-logo-1" />
      <circle cx="42.39" cy="36" r="24" className="fill-logo-shadow" opacity="0.22" clipPath={`url(#${bottomClip})`} />
      <circle cx="45.39" cy="36" r="24" className="fill-logo-2" />
      <circle cx="66.01" cy="36" r="24" className="fill-logo-shadow" opacity="0.16" clipPath={`url(#${middleClip})`} />
      <circle cx="69.01" cy="36" r="24" className="fill-logo-3" />
    </svg>
  )
}

interface BrandLogoProps {
  /** `sm` — sidebar, `lg` — login sahifasi. */
  size?: 'sm' | 'lg'
  showTagline?: boolean
  showVersion?: boolean
  className?: string
}

const SIZES = {
  sm: { mark: 'h-7 w-auto', word: 'text-xl', gap: 'gap-2' },
  lg: { mark: 'h-11 w-auto', word: 'text-3xl', gap: 'gap-3' },
} as const

const TAGLINE_SIZE = {
  sm: 'text-3xs',
  lg: 'text-xs',
} as const

/** Belgi + "Zucco CRM" (bitta shrift, bitta qalinlik, bitta rang); ixtiyoriy kichik versiya va shior. */
export function BrandLogo({ size = 'sm', showTagline = false, showVersion = false, className }: BrandLogoProps) {
  const { t } = useTranslation()
  const sizes = SIZES[size]

  return (
    <div
      role="img"
      aria-label={t.layout.brandName}
      className={cn('inline-flex flex-col leading-none select-none', className)}
    >
      <div className={cn('flex items-center text-heading', sizes.gap)}>
        <BrandMark className={sizes.mark} />
        <span aria-hidden="true" className={cn('font-bold tracking-tight whitespace-nowrap', sizes.word)}>
          {t.layout.brandName}
        </span>
        {showVersion && (
          <span className="self-end text-3xs font-medium text-subtle">{APP_VERSION}</span>
        )}
      </div>
      {showTagline && (
        <span className={cn('mt-1.5 font-medium tracking-wide text-caption', TAGLINE_SIZE[size])}>
          {t.layout.brandTagline}
        </span>
      )}
    </div>
  )
}
