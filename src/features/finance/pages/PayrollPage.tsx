import { useState } from 'react'
import { Banknote, CheckCircle2, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'sonner'
import { formatCurrency } from '@/utils/formatters'

interface PayrollRecord {
  id: string
  teacherName: string
  schemeType: 'Тушумдан 40%' | 'Дарсбай 50,000 сўм' | 'Талаба бошига 100,000' | 'Ойлик 6,000,000'
  studentsCount: number
  lessonsCount: number
  calculatedAmount: number
  status: 'Pending' | 'Approved' | 'Paid'
}

const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pr-1',
    teacherName: 'Азиз Каримов (IELTS)',
    schemeType: 'Тушумдан 40%',
    studentsCount: 38,
    lessonsCount: 36,
    calculatedAmount: 8200000,
    status: 'Pending',
  },
  {
    id: 'pr-2',
    teacherName: 'Шаҳноза Раҳимова (English)',
    schemeType: 'Талаба бошига 100,000',
    studentsCount: 46,
    lessonsCount: 48,
    calculatedAmount: 4600000,
    status: 'Approved',
  },
  {
    id: 'pr-3',
    teacherName: 'Жасур Алимов (Frontend)',
    schemeType: 'Дарсбай 50,000 сўм',
    studentsCount: 26,
    lessonsCount: 32,
    calculatedAmount: 5400000,
    status: 'Paid',
  },
]

export function PayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>(INITIAL_PAYROLL)

  const handleApprove = (id: string) => {
    setPayroll((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Approved' } : p))
    )
    toast.success('Маош муваффақиятли тасдиқланди!')
  }

  const handlePay = (id: string) => {
    setPayroll((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Paid' } : p))
    )
    toast.success('Маош кассадан тўланди ва харажат сифатида ёзилди!')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Ўқитувчилар маоши (Payroll)
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            4 хил маош схемаси бўйича автоматик ҳисоблаш, тасдиқлаш ва кассадан тўлаш
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Calculator className="w-3.5 h-3.5" />
          <span>Ноябрь маошларини ҳисоблаш</span>
        </Button>
      </div>

      <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F8F7] border-b border-[#E3EAE5] text-[#65776C] text-[11px] font-semibold">
              <th className="py-3 px-4">Ўқитувчи</th>
              <th className="py-3 px-4">Тўлов схемаси</th>
              <th className="py-3 px-4">Талаба / Дарс сони</th>
              <th className="py-3 px-4">Ҳисобланган маош</th>
              <th className="py-3 px-4">Ҳолати</th>
              <th className="py-3 px-4 text-right">Амал</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4F1]">
            {payroll.map((p) => (
              <tr key={p.id} className="hover:bg-[#FCFEFC] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#1E2B24]">
                  {p.teacherName}
                </td>
                <td className="py-3.5 px-4">
                  <Badge variant="accent">{p.schemeType}</Badge>
                </td>
                <td className="py-3.5 px-4 tabular-nums text-[#4D6255]">
                  {p.studentsCount} талаба · {p.lessonsCount} дарс
                </td>
                <td className="py-3.5 px-4 tabular-nums font-bold text-[#1E2B24] text-sm">
                  {formatCurrency(p.calculatedAmount)}
                </td>
                <td className="py-3.5 px-4">
                  {p.status === 'Pending' && <Badge variant="warning">Кутилмоқда</Badge>}
                  {p.status === 'Approved' && <Badge variant="accent">Тасдиқланган</Badge>}
                  {p.status === 'Paid' && <Badge variant="success">Тўланган</Badge>}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {p.status === 'Pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(p.id)}
                    >
                      Тасдиқлаш
                    </Button>
                  )}
                  {p.status === 'Approved' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handlePay(p.id)}
                    >
                      <Banknote className="w-3 h-3" />
                      <span>Кассадан тўлаш</span>
                    </Button>
                  )}
                  {p.status === 'Paid' && (
                    <span className="text-[11px] text-[#047857] font-semibold flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Тўлов якунланган</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
