import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatters'

const ACTIVITIES = [
  {
    id: 'c-1',
    student: 'Темур Бекмирзаев (ZU-0248)',
    type: 'Давомат (+5 танга)',
    amount: 5,
    isEarn: true,
    date: '2026-11-03T14:30:00Z',
    reason: 'IELTS Foundation дарсида қатнашди',
  },
  {
    id: 'c-2',
    student: 'Шаҳзода Низомова (ZU-0189)',
    type: 'Уй вазифаси аъло (+5 танга)',
    amount: 5,
    isEarn: true,
    date: '2026-11-03T11:00:00Z',
    reason: 'Уй иши 100% тўғри бажарилган',
  },
  {
    id: 'c-3',
    student: 'Камила Исмоилова (ZU-0155)',
    type: 'Совға харид қилинди (-45 танга)',
    amount: 45,
    isEarn: false,
    date: '2026-11-02T17:10:00Z',
    reason: 'Zucco Блокнот тўплами',
  },
]

export function CoinActivityPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Тангалар тарихи
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Барча талабаларнинг танга олиши ва сарфлаши бўйича логлар
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F8F7] border-b border-[#E3EAE5] text-[#65776C] text-[11px] font-semibold">
              <th className="py-3 px-4">Талаба</th>
              <th className="py-3 px-4">Амал тури</th>
              <th className="py-3 px-4">Сабаб / Изоҳ</th>
              <th className="py-3 px-4">Сана</th>
              <th className="py-3 px-4 text-right">Тангалар</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4F1]">
            {ACTIVITIES.map((act) => (
              <tr key={act.id} className="hover:bg-[#FCFEFC] transition-colors">
                <td className="py-3 px-4 font-semibold text-[#1E2B24]">
                  {act.student}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={act.isEarn ? 'success' : 'danger'}>
                    {act.type}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-[#4D6255]">{act.reason}</td>
                <td className="py-3 px-4 text-[#8B9C91] tabular-nums">
                  {formatDate(act.date)}
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  <span
                    className={`font-bold ${
                      act.isEarn ? 'text-[#047857]' : 'text-[#BE123C]'
                    }`}
                  >
                    {act.isEarn ? '+' : '-'}
                    {act.amount} танга
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
