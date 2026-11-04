import { useState } from 'react'
import { Plus, Calendar, Clock, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/formatters'

interface GroupItem {
  id: string
  name: string
  courseName: string
  teacherName: string
  roomName: string
  days: string
  time: string
  capacity: number
  enrolledCount: number
  price: number
  billingMode: 'CalendarMonth' | 'Rolling30' | 'PerLesson'
  status: 'Active' | 'Planned' | 'Archived'
}

const GROUPS_DATA: GroupItem[] = [
  {
    id: 'g1',
    name: 'IF-09',
    courseName: 'IELTS Foundation',
    teacherName: 'Азиз Каримов',
    roomName: '302-хона',
    days: 'Ду / Чор / Жума',
    time: '14:00 - 15:30',
    capacity: 14,
    enrolledCount: 12,
    price: 650000,
    billingMode: 'CalendarMonth',
    status: 'Active',
  },
  {
    id: 'g2',
    name: 'GE-04',
    courseName: 'General English Conversation',
    teacherName: 'Шаҳноза Раҳимова',
    roomName: '104-хона',
    days: 'Сеш / Пай / Шан',
    time: '15:30 - 17:00',
    capacity: 12,
    enrolledCount: 10,
    price: 500000,
    billingMode: 'Rolling30',
    status: 'Active',
  },
  {
    id: 'g3',
    name: 'FE-02',
    courseName: 'Frontend React Development',
    teacherName: 'Жасур Алимов',
    roomName: 'Lab-1',
    days: 'Ду / Чор / Жума',
    time: '17:00 - 18:30',
    capacity: 16,
    enrolledCount: 14,
    price: 800000,
    billingMode: 'PerLesson',
    status: 'Active',
  },
  {
    id: 'g4',
    name: 'M-11',
    courseName: 'Matematika Intensive',
    teacherName: 'Улуғбек Содиқов',
    roomName: '201-хона',
    days: 'Сеш / Пай / Шан',
    time: '18:30 - 20:00',
    capacity: 10,
    enrolledCount: 8,
    price: 400000,
    billingMode: 'CalendarMonth',
    status: 'Active',
  },
]

export function GroupListPage() {
  const [search, setSearch] = useState('')

  const filtered = GROUPS_DATA.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.courseName.toLowerCase().includes(search.toLowerCase()) ||
      g.teacherName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Ўқув гуруҳлари
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Фаол ва режалаштирилган гуруҳлар, сиғим, ўқитувчилар ва дарслар жадвали
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Янги гуруҳ очиш</span>
        </Button>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E3EAE5] shadow-xs">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B9C91]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Гуруҳ, курс ёки ўқитувчи..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#F6F8F7] border border-[#E3EAE5] rounded-md text-[#1E2B24] placeholder:text-[#8B9C91] focus:outline-none focus:ring-1 focus:ring-[#146B52]"
          />
        </div>
        <span className="text-xs text-[#65776C]">
          Жами гуруҳлар: <strong className="text-[#1E2B24]">{filtered.length}</strong>
        </span>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((group) => {
          const isAlmostFull = group.enrolledCount >= group.capacity - 2
          return (
            <div
              key={group.id}
              className="bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-3.5 hover:border-[#BBDCCB] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1E2B24]">
                    {group.name} · {group.courseName}
                  </h3>
                  <p className="text-xs text-[#65776C] mt-0.5">
                    Ўқитувчи: <strong className="text-[#344B3E] font-medium">{group.teacherName}</strong>
                  </p>
                </div>
                <Badge variant="success">Фаол</Badge>
              </div>

              {/* Schedule and room */}
              <div className="grid grid-cols-2 gap-2 text-xs text-[#4D6255] bg-[#F6F8F7] p-2.5 rounded-md border border-[#E3EAE5]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#146B52]" />
                  <span className="truncate">{group.days}</span>
                </div>
                <div className="flex items-center gap-1.5 tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-[#146B52]" />
                  <span>{group.time}</span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#65776C]">Гуруҳ сиғими</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      isAlmostFull ? 'text-[#BE123C]' : 'text-[#047857]'
                    }`}
                  >
                    {group.enrolledCount} / {group.capacity} талаба
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#EDF2EE] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isAlmostFull ? 'bg-[#E11D48]' : 'bg-[#146B52]'
                    }`}
                    style={{
                      width: `${(group.enrolledCount / group.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Price & Billing Mode */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F0F4F1] text-xs">
                <span className="text-[#65776C]">
                  Модель: <strong className="text-[#344B3E] font-medium">{group.billingMode}</strong>
                </span>
                <span className="font-bold text-[#146B52] tabular-nums text-sm">
                  {formatCurrency(group.price)} / ой
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
