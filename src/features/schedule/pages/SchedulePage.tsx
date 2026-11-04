import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const DAYS = ['Душанба (03)', 'Сешанба (04)', 'Чоршанба (05)', 'Пайшанба (06)', 'Жума (07)', 'Шанба (08)']
const HOURS = ['09:00', '11:00', '14:00', '15:30', '17:00', '18:30', '20:00']

export function SchedulePage() {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Ҳафталик жадвал
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Хоналар ва ўқитувчилар бўйича ҳафталик дарслар тақсимоти
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs font-semibold text-[#1E2B24] px-2">
            03 — 08 Ноябрь, 2026
          </span>
          <Button variant="secondary" size="sm">
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Schedule Grid Panel */}
      <div className="bg-white border border-[#E3EAE5] rounded-lg shadow-xs overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-[#E3EAE5] bg-[#F6F8F7] text-xs font-semibold text-[#65776C]">
          <div className="py-3 px-3 border-r border-[#E3EAE5] text-center w-20">
            Вақт
          </div>
          {DAYS.map((day, idx) => (
            <div
              key={idx}
              className={`py-3 px-3 text-center border-r last:border-r-0 border-[#E3EAE5] ${
                idx === 0 ? 'bg-[#E8F3ED] text-[#146B52] font-bold' : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Schedule Body */}
        <div className="divide-y divide-[#F0F4F1]">
          {HOURS.map((hour, idx) => (
            <div key={idx} className="grid grid-cols-7 min-h-[72px]">
              {/* Time Label */}
              <div className="py-2 px-3 border-r border-[#E3EAE5] text-[11px] font-medium text-[#8B9C91] text-center bg-[#F6F8F7]/50 flex items-center justify-center">
                {hour}
              </div>

              {/* Day slots */}
              {DAYS.map((_, dayIdx) => {
                const hasLesson =
                  (dayIdx === 0 && hour === '14:00') ||
                  (dayIdx === 2 && hour === '14:00') ||
                  (dayIdx === 1 && hour === '15:30') ||
                  (dayIdx === 0 && hour === '17:00')

                return (
                  <div
                    key={dayIdx}
                    className="p-1.5 border-r last:border-r-0 border-[#F0F4F1] hover:bg-[#F6F8F7]/40 transition-colors"
                  >
                    {hasLesson && (
                      <div className="h-full p-2 rounded bg-[#E8F3ED] border border-[#BBDCCB] border-l-4 border-l-[#146B52] text-[#15583F] text-[11px] flex flex-col justify-between shadow-2xs">
                        <span className="font-bold truncate">
                          {dayIdx === 1 ? 'GE-04 · Eng' : 'IF-09 · IELTS'}
                        </span>
                        <div className="flex justify-between items-center text-[10px] text-[#4D6255] mt-1">
                          <span>{dayIdx === 1 ? '104-хона' : '302-хона'}</span>
                          <span className="tabular-nums">12/14</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
