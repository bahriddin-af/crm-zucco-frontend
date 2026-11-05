import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

/** Sarlavha, izoh va ixtiyoriy amallar bilan oq karta-bo'lim. */
export function SectionCard({ title, subtitle, actions, children }: SectionCardProps) {
  return (
    <section className="bg-surface rounded-lg border border-border shadow-xs">
      <header className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-heading">{title}</h2>
          {subtitle && <p className="text-2xs text-caption mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}
