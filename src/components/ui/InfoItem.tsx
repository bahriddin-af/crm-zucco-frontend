import type { ReactNode } from 'react'

interface InfoItemProps {
  label: string
  children: ReactNode
}

/** Tafsilot kartalaridagi "nom: qiymat" juftligi. */
export function InfoItem({ label, children }: InfoItemProps) {
  return (
    <div className="min-w-0 space-y-0.5">
      <dt className="text-2xs text-caption">{label}</dt>
      <dd className="text-xs font-semibold text-heading truncate">{children}</dd>
    </div>
  )
}
