import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Clock, BookOpen, Search, Trash2, Edit2, Layers, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency } from '@/utils/formatters'
import { apiClient } from '@/api/client'
import { API_ROUTES } from '@/api/apiRoutes'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse, PagedResult } from '@/types/api'
import {
  COURSE_LEVEL_LABELS,
  type CourseListItem,
  type SubjectItem,
} from '../types/courseTypes'
import { CourseModal } from '../components/CourseModal'
import { toast } from 'sonner'

export function CourseListPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseListItem | null>(null)
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all')

  // 1. Fetch live courses from Backend API
  const {
    data: coursesData,
    isLoading: isCoursesLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.COURSES.ALL,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PagedResult<CourseListItem>>>(
        API_ROUTES.COURSES.LIST,
        {
          params: {
            page: 1,
            pageSize: 50,
          },
        }
      )
      return response.data.data
    },
  })

  // 2. Fetch live subjects from Backend API
  const { data: subjects = [] } = useQuery({
    queryKey: ['courses', 'subjects'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<SubjectItem[]>>(
        API_ROUTES.COURSES.SUBJECTS
      )
      return response.data.data
    },
  })

  // 3. Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ROUTES.COURSES.DELETE(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COURSES.ALL })
      toast.success('Курс муваффақиятли ўчирилди!')
    },
    onError: () => {
      toast.error('Курсни ўчиришда хатолик юз берди')
    },
  })

  const handleDelete = (course: CourseListItem) => {
    if (window.confirm(`"${course.name}" курсини ўчиришни тасдиқлайсизми?`)) {
      deleteMutation.mutate(course.id)
    }
  }

  const handleEdit = (course: CourseListItem) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  const handleOpenCreate = () => {
    setSelectedCourse(null)
    setIsModalOpen(true)
  }

  const courses = coursesData?.items || []

  // Filter courses by search query and subject
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSubject =
        selectedSubjectFilter === 'all' || course.subjectId === selectedSubjectFilter
      return matchesSearch && matchesSubject
    })
  }, [courses, searchTerm, selectedSubjectFilter])

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
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            title="Янгилаш"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <Plus className="w-3.5 h-3.5" />
            <span>Янги курс қўшиш</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E3EAE5]">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9C91]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Курс ёки йўналиш бўйича қидириш..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-[#E3EAE5] focus:outline-none focus:ring-1 focus:ring-[#146B52]"
          />
        </div>

        {/* Subjects Quick Filter Tabs */}
        {subjects.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedSubjectFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedSubjectFilter === 'all'
                  ? 'bg-[#146B52] text-white'
                  : 'bg-[#F6F8F7] text-[#65776C] hover:bg-[#E8F3ED]'
              }`}
            >
              Барчаси ({courses.length})
            </button>
            {subjects.map((subj) => {
              const count = courses.filter((c) => c.subjectId === subj.id).length
              return (
                <button
                  key={subj.id}
                  onClick={() => setSelectedSubjectFilter(subj.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                    selectedSubjectFilter === subj.id
                      ? 'bg-[#146B52] text-white'
                      : 'bg-[#F6F8F7] text-[#65776C] hover:bg-[#E8F3ED]'
                  }`}
                >
                  {subj.name} ({count})
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Loading Skeletons */}
      {isCoursesLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#E3EAE5] rounded-lg p-5 space-y-4"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="pt-3 border-t border-[#F0F4F1] flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isCoursesLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center space-y-3">
          <p className="text-xs text-red-600">
            Курсларни юклашда хатолик юз берди:{' '}
            {error instanceof Error ? error.message : 'Серверга уланиш имконсиз'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Қайта уриниш
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isCoursesLoading && !isError && filteredCourses.length === 0 && (
        <EmptyState
          title="Курслар топилмади"
          description={
            searchTerm
              ? `"${searchTerm}" қидируви бўйича ҳеч қандай курс топилмади.`
              : 'Тизимда ҳозирча фаол курслар мавжуд эмас. Янги курс қўшинг.'
          }
          icon={<BookOpen className="w-5 h-5" />}
          action={
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              <Plus className="w-3.5 h-3.5" />
              <span>Биринчи курсни қўшиш</span>
            </Button>
          }
        />
      )}

      {/* Live Courses Grid */}
      {!isCoursesLoading && !isError && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCourses.map((course) => {
            const totalLessons = course.durationMonths * course.lessonsPerMonth
            const levelLabel =
              COURSE_LEVEL_LABELS[course.level] || 'Умумий'

            return (
              <div
                key={course.id}
                className="group relative bg-white border border-[#E3EAE5] rounded-lg p-5 shadow-xs space-y-4 hover:border-[#BBDCCB] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                {/* Top Actions (Edit / Delete) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#146B52] bg-[#E8F3ED] px-2 py-0.5 rounded truncate max-w-[120px]">
                      {course.subjectName || 'Фан'}
                    </span>
                    <Badge variant="accent">{levelLabel}</Badge>
                  </div>

                  <h3 className="text-sm font-bold text-[#1E2B24] group-hover:text-[#146B52] transition-colors">
                    {course.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#65776C]">
                    <Clock className="w-3.5 h-3.5 text-[#8B9C91]" />
                    <span>
                      {course.durationMonths} ой ({totalLessons} та дарс)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#65776C]">
                    <Layers className="w-3.5 h-3.5 text-[#8B9C91]" />
                    <span>
                      {course.lessonsPerMonth} та дарс/ой · {course.lessonDurationMinutes} дақиқа
                    </span>
                  </div>
                </div>

                {/* Footer with Price and Actions */}
                <div className="pt-3 border-t border-[#F0F4F1] flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-[#65776C]">Ойлик тўлов:</span>
                    <span className="text-sm font-bold text-[#146B52] tabular-nums">
                      {formatCurrency(course.basePrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleEdit(course)}
                      className="p-1.5 text-[#65776C] hover:text-[#146B52] hover:bg-[#F0F4F1] rounded transition-colors"
                      title="Таҳрирлаш"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(course)}
                      className="p-1.5 text-[#65776C] hover:text-[#BE123C] hover:bg-[#FFF1F2] rounded transition-colors"
                      title="Ўчириш"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Course Modal (Create & Edit) */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCourse(null)
        }}
        subjects={subjects}
        courseToEdit={selectedCourse}
      />
    </div>
  )
}
