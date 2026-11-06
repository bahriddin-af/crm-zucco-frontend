import { KanbanSquare, Table2 } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { cn } from '@/utils/cn'
import { LEADS_VIEW, type LeadsView } from '../constants/leadsView'

interface LeadsViewToggleProps {
  value: LeadsView
  onChange: (view: LeadsView) => void
}

/** Lidlar sahifasi ko'rinishi: voronka (kanban) yoki sahifali jadval. */
export function LeadsViewToggle({ value, onChange }: LeadsViewToggleProps) {
  const { t } = useTranslation()
  const options = [
    { view: LEADS_VIEW.Kanban, label: t.leads.table.kanbanView, Icon: KanbanSquare },
    { view: LEADS_VIEW.Table, label: t.leads.table.tableView, Icon: Table2 },
  ]

  return (
    <div role="group" aria-label={t.leads.table.viewLabel} className="inline-flex rounded-md border border-border bg-surface p-0.5">
      {options.map(({ view, label, Icon }) => (
        <button
          key={view}
          type="button"
          aria-pressed={value === view}
          onClick={() => onChange(view)}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
            value === view ? 'bg-primary-soft text-primary' : 'text-caption hover:text-heading'
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
