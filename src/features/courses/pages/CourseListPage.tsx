import { Plus, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/formatters'

const COURSES = [
  {
    id: 'c1',
    code: 'IELTS-FND',
    title: 'IELTS Foundation',
    duration: '3 ой (36 та дарс)',
    price: 650000,
    activeGroups: 3,
    studentsCount: 38,
    level: 'Intermediate (B1)',
  },
  {
    id: 'c2',
    code: 'GEN-ENG',
    title: 'General English Conversation',
    duration: '6 ой (72 та дарс)',
    price: 500000,
    activeGroups: 4,
    studentsCount: 46,
    level: 'Beginner - Upper',
  },
  {
    id: 'c3',
    code: 'FE-DEV',
    title: 'Frontend React Development',
    duration: '4 ой (48 та дарс)',
    price: 800000,
    activeGroups: 2,
    studentsCount: 26,
    level: 'Junior Frontend',
  },
  {
    id: 'c4',
    code: 'MATH-INT',
    title: 'Matematika Intensive & DTM',
    duration: '9 ой (108 та дарс)',
    price: 400000,
    activeGroups: 3,
    studentsCount: 32,
    level: 'Abiturient',
  },
]

export function CourseListPage() {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E2B24] tracking-tight">
            Курслар каталоги
          </h1>
          <p className="text-xs text-[#65776C] mt-0.5">
            Ўқув марказидаги барча таълим йўналишлари, нархлар ва давомийлик
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Янги курс қўшиш</span>
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COURSES.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-4 hover:border-[#BBDCCB] transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#146B52] bg-[#E8F3ED] px-2 py-0.5 rounded">
                  {course.code}
                </span>
                <Badge variant="accent">{course.level}</Badge>
              </div>

              <h3 className="text-sm font-bold text-[#1E2B24]">
                {course.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-[#65776C]">
                <Clock className="w-3.5 h-3.5 text-[#8B9C91]" />
                <span>{course.duration}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#65776C]">
                <Users className="w-3.5 h-3.5 text-[#8B9C91]" />
                <span>
                  {course.activeGroups} та гуруҳ · {course.studentsCount} талаба
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0F4F1] flex items-center justify-between">
              <span className="text-[11px] text-[#65776C]">Ойлик тўлов:</span>
              <span className="text-sm font-bold text-[#146B52] tabular-nums">
                {formatCurrency(course.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
