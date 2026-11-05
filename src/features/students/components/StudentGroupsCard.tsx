import { interpolate, useTranslation } from '@/i18n'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { EnrolledGroupInfo } from '../types/studentTypes'

export function StudentGroupsCard({ groups }: { groups: EnrolledGroupInfo[] }) {
  const { t } = useTranslation()

  return (
    <section className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-heading">{interpolate(t.students.detail.groupsTitle, { count: groups.length })}</h3>

      {groups.length === 0 ? (
        <p className="text-xs text-subtle py-4">{t.students.detail.noGroups}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {groups.map((group) => (
            <div key={group.groupId} className="p-3.5 bg-canvas border border-border rounded-lg space-y-2 hover:border-primary-line transition-colors">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="text-xs font-bold text-heading">{group.groupName}</h4>
                  <p className="text-2xs text-caption">{group.courseName}</p>
                </div>
                <span className="text-3xs bg-primary-soft text-primary font-semibold px-2 py-0.5 rounded">
                  {interpolate(t.students.detail.teacher, { name: group.teacherName })}
                </span>
              </div>
              <div className="flex justify-between text-xs text-copy-strong pt-1 border-t border-border">
                <span>{interpolate(t.students.detail.joined, { date: formatDate(group.joinedDate) })}</span>
                {group.customPrice != null && (
                  <span className="font-semibold text-primary">
                    {interpolate(t.students.detail.price, { price: formatCurrency(group.customPrice) })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
