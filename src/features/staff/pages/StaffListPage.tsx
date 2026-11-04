import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPhone } from '@/utils/formatters'

const STAFF_MEMBERS = [
  {
    id: 'st-1',
    name: 'Алишер Усмонов',
    phone: '998901234567',
    role: 'Owner (Раҳбар)',
    branch: 'Барча филиаллар',
    status: 'Active',
  },
  {
    id: 'st-2',
    name: 'Азиз Каримов',
    phone: '998935554433',
    role: 'Teacher (IELTS)',
    branch: 'Чилонзор филиали',
    status: 'Active',
  },
  {
    id: 'st-3',
    name: 'Шаҳноза Раҳимова',
    phone: '998941112233',
    role: 'Teacher (General English)',
    branch: 'Чилонзор филиали',
    status: 'Active',
  },
  {
    id: 'st-4',
    name: 'Зулфия Раҳимова',
    phone: '998971112233',
    role: 'Cashier (Кассир)',
    branch: 'Чилонзор филиали',
    status: 'Active',
  },
]

export function StaffListPage() {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Ходимлар ва ўқитувчилар
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Марказ ходимлари, уларнинг лавозими, филиаллари ва роллари
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Янги ходим қўшиш</span>
        </Button>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F8F7] border-b border-[#E3EAE5] text-[#65776C] text-[11px] font-semibold">
              <th className="py-3 px-4">Ф.И.Ш</th>
              <th className="py-3 px-4">Телефон</th>
              <th className="py-3 px-4">Лавозим / Роль</th>
              <th className="py-3 px-4">Филиал</th>
              <th className="py-3 px-4">Ҳолати</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4F1]">
            {STAFF_MEMBERS.map((staff) => (
              <tr key={staff.id} className="hover:bg-[#FCFEFC] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#1E2B24]">
                  {staff.name}
                </td>
                <td className="py-3.5 px-4 tabular-nums text-[#4D6255]">
                  {formatPhone(staff.phone)}
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant="accent">{staff.role}</Badge>
                </td>
                <td className="py-3.5 px-4 text-[#65776C]">
                  {staff.branch}
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant="success">Ишламоқда</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
