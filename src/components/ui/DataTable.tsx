import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'right'
}

interface DataTableProps {
  columns: TableColumn[]
  children: ReactNode
}

/** Jadvallar uchun umumiy karkas (sarlavha + tana). */
export function DataTable({ columns, children }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-canvas border-b border-border text-caption text-2xs font-semibold">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn('py-2.5 px-3 whitespace-nowrap', column.align === 'right' && 'text-right')}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-divider">{children}</tbody>
      </table>
    </div>
  )
}

export const CELL_CLASS = 'py-3 px-3 align-middle'
