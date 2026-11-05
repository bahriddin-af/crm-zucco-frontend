import { useState, type FormEvent } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n'
import { STUDENT_SEARCH_PARAM } from '@/features/students/constants/studentConstants'

/** Enter bosilganda talabalar ro'yxatini shu qidiruv bilan ochadi. */
export function GlobalStudentSearch() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const canViewStudents = useAuthStore((state) => state.hasPermission(PERMISSIONS.STUDENTS.VIEW))
  const [query, setQuery] = useState('')

  if (!canViewStudents) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const search = query.trim()
    navigate({
      pathname: ROUTES.STUDENTS.LIST,
      search: search ? createSearchParams({ [STUDENT_SEARCH_PARAM]: search }).toString() : '',
    })
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative w-56 hidden md:block">
      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.layout.searchPlaceholder}
        aria-label={t.layout.searchPlaceholder}
        className="w-full h-8 pl-8 pr-3 text-xs bg-canvas border border-border rounded-md text-heading placeholder:text-subtle focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </form>
  )
}
