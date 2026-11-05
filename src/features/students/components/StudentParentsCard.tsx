import { useTranslation } from '@/i18n'
import { formatPhone } from '@/utils/formatters'
import type { StudentDetail } from '../types/studentTypes'

export function StudentParentsCard({ student }: { student: StudentDetail }) {
  const { t } = useTranslation()

  return (
    <section className="bg-white border border-border rounded-xl p-5 shadow-xs space-y-3">
      <h3 className="text-sm font-bold text-heading">{t.students.detail.parentsTitle}</h3>
      {student.parents.length === 0 ? (
        <p className="text-xs text-subtle">{t.students.detail.noParents}</p>
      ) : (
        <ul className="divide-y divide-divider">
          {student.parents.map((parent) => (
            <li key={parent.id ?? parent.phone} className="flex justify-between gap-3 py-2 text-xs">
              <div>
                <p className="font-semibold text-heading">{parent.fullName}</p>
                <p className="text-[11px] text-caption">{t.students.relationships[parent.relationship]}</p>
              </div>
              <a href={`tel:${parent.phone}`} className="tabular-nums text-copy-strong hover:text-primary">
                {formatPhone(parent.phone)}
              </a>
            </li>
          ))}
        </ul>
      )}
      {student.note && (
        <div className="pt-2 border-t border-divider">
          <p className="text-[10px] text-caption font-medium">{t.students.detail.note}</p>
          <p className="text-xs text-copy-strong">{student.note}</p>
        </div>
      )}
    </section>
  )
}
