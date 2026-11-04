import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'sonner'
import { formatDate } from '@/utils/formatters'

export function SmsCenterPage() {
  const [recipientGroup, setRecipientGroup] = useState('debtors')
  const [message, setMessage] = useState('Ҳурматли ота-она, талабангизнинг Zucco ўқув маркази бўйича ўқув қарздорлиги мавжуд. Тўловни ўз вақтида амалга оширишингизни сўраймиз.')

  const handleSend = () => {
    toast.success('SMS хабарномалар муваффақиятли навбатга қўйилди!')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            SMS маркази
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Талабалар ва ота-оналарга эслатма, давомат ва тўлов хабарномаларини юбориш
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Compose SMS Form */}
        <div className="bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-semibold text-[#1E2B24]">
            Янги хабарнома юбориш
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Қабул қилувчилар гуруҳи
            </label>
            <select
              value={recipientGroup}
              onChange={(e) => setRecipientGroup(e.target.value)}
              className="w-full min-h-[34px] rounded-md border border-[#E3EAE5] bg-white px-3 py-1.5 text-xs text-[#1E2B24] focus:outline-none focus:ring-2 focus:ring-[#418A66]"
            >
              <option value="debtors">Барча қарздор талабалар ота-оналарига (14 нафар)</option>
              <option value="g1">IELTS Foundation (IF-09) гуруҳига (12 нафар)</option>
              <option value="all">Марказдаги барча фаол талабаларга (148 нафар)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E2B24] mb-1">
              Хабар матни
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md border border-[#E3EAE5] bg-white p-3 text-xs text-[#1E2B24] focus:outline-none focus:ring-2 focus:ring-[#418A66]"
            />
            <span className="text-[10px] text-[#8B9C91] mt-1 block">
              Белгилар сони: {message.length} (1 та SMS)
            </span>
          </div>

          <Button variant="primary" size="sm" onClick={handleSend} className="w-full">
            <Send className="w-3.5 h-3.5" />
            <span>Юборишни бошлаш</span>
          </Button>
        </div>

        {/* Right 2 cols: History */}
        <div className="lg:col-span-2 bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E3EAE5]">
            <h2 className="text-xs font-semibold text-[#1E2B24]">
              Охирги юборилган хабарномалар
            </h2>
          </div>

          <div className="divide-y divide-[#F0F4F1]">
            {[
              {
                title: 'Тўлов эслатмаси',
                recipients: '14 та ота-она',
                status: 'Етказилди (100%)',
                variant: 'success' as const,
                date: '2026-11-03T09:00:00Z',
              },
              {
                title: 'IF-09 дарс вақти кўчирилди',
                recipients: '12 та талаба',
                status: 'Етказилди',
                variant: 'success' as const,
                date: '2026-11-02T15:30:00Z',
              },
              {
                title: 'Янги IELTS Intensive гуруҳи очилиши',
                recipients: '28 та лид',
                status: 'Жараёнда',
                variant: 'accent' as const,
                date: '2026-11-01T12:00:00Z',
              },
            ].map((sms, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#F6F8F7] transition-colors">
                <div>
                  <h3 className="text-xs font-semibold text-[#1E2B24]">{sms.title}</h3>
                  <p className="text-[11px] text-[#65776C] mt-0.5">
                    Қабул қилувчилар: {sms.recipients} · {formatDate(sms.date)}
                  </p>
                </div>
                <Badge variant={sms.variant}>{sms.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
