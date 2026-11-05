import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  /** Placeholder va `aria-label` sifatida ishlatiladi. */
  placeholder: string
  className?: string
}

/** Ro'yxat qidiruvi: ikonka + `Input`. Debounce chaqiruvchida (`useDebouncedValue`). */
export function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
  return (
    <div className={cn('relative w-full sm:w-64', className)}>
      <Search className="w-3.5 h-3.5 text-subtle absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-8"
      />
    </div>
  )
}
