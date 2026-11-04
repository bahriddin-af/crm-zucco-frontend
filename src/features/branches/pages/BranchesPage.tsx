import { Plus, DoorClosed } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const BRANCHES = [
  {
    id: 'b1',
    name: 'Асосий филиал (Чилонзор)',
    address: 'Чилонзор 9-мавзе, 12-уй',
    phone: '+998 (71) 200-00-21',
    roomsCount: 8,
    activeStudents: 148,
    isMain: true,
  },
  {
    id: 'b2',
    name: 'Юнусобод филиали',
    address: 'Юнусобод 4-мавзе, Mega Planet рўпараси',
    phone: '+998 (71) 200-00-22',
    roomsCount: 6,
    activeStudents: 92,
    isMain: false,
  },
  {
    id: 'b3',
    name: 'Мирзо Улуғбек филиали',
    address: 'Буюк Ипак Йўли м., 45-уй',
    phone: '+998 (71) 200-00-23',
    roomsCount: 5,
    activeStudents: 74,
    isMain: false,
  },
]

export function BranchesPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Филиаллар ва хоналар
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Ўқув филиаллари, аудиториялар ва сиғимларни бошқариш
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Янги филиал қўшиш</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BRANCHES.map((b) => (
          <div
            key={b.id}
            className="bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-4 hover:border-[#BBDCCB] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#1E2B24]">{b.name}</h3>
                <p className="text-xs text-[#65776C] mt-0.5">{b.address}</p>
              </div>
              {b.isMain && <Badge variant="accent">Бош офис</Badge>}
            </div>

            <div className="pt-3 border-t border-[#F0F4F1] flex items-center justify-between text-xs text-[#4D6255]">
              <div className="flex items-center gap-1.5">
                <DoorClosed className="w-3.5 h-3.5 text-[#146B52]" />
                <span>{b.roomsCount} та хона</span>
              </div>
              <span className="font-semibold text-[#146B52] tabular-nums">
                {b.activeStudents} талаба
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
