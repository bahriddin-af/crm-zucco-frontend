import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface WidgetCardProps {
  title: string
  icon?: ReactNode
  linkTo: string
  linkLabel: string
  className?: string
  children: ReactNode
}

export function WidgetCard({ title, icon, linkTo, linkLabel, className, children }: WidgetCardProps) {
  return (
    <section className={cn('bg-surface border border-border rounded-lg shadow-xs overflow-hidden flex flex-col', className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xs font-semibold text-heading">{title}</h2>
        </div>
        <Link to={linkTo} className="text-2xs font-medium text-primary hover:underline flex items-center gap-1">
          {linkLabel}
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      {children}
    </section>
  )
}
