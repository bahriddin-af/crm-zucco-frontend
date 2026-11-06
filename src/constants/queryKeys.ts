/**
 * TanStack Query kesh kalitlari. Har bir modulning `ALL` kaliti shu modulning barcha
 * so'rovlarini invalidate qilish uchun prefiks bo'lib xizmat qiladi.
 */
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  BRANCHES: {
    ALL: ['branches'] as const,
    LIST: (filters?: Record<string, unknown>) => ['branches', 'list', filters] as const,
    DETAIL: (id: string) => ['branches', id] as const,
    ROOMS: (branchId: string) => ['branches', branchId, 'rooms'] as const,
  },
  LEADS: {
    ALL: ['leads'] as const,
    LIST: (filters?: Record<string, unknown>) => ['leads', 'list', filters] as const,
    KANBAN: (filters?: Record<string, unknown>) => ['leads', 'kanban', filters] as const,
    DETAIL: (id: string) => ['leads', id] as const,
    STAGES: ['leads', 'stages'] as const,
    SOURCES: ['leads', 'sources'] as const,
  },
  STUDENTS: {
    ALL: ['students'] as const,
    LIST: (filters?: Record<string, unknown>) => ['students', 'list', filters] as const,
    DETAIL: (id: string) => ['students', id] as const,
    /** Xavf kalitlari `students` prefiksi ostida — talaba o'zgarganda ular ham yangilanadi. */
    RISK_ALL: ['students', 'risk'] as const,
    RISK_LIST: (filters?: Record<string, unknown>) => ['students', 'risk', 'list', filters] as const,
    RISK_SUMMARY: ['students', 'risk', 'summary'] as const,
    RISK_HISTORY: (id: string, days: number) => ['students', 'risk', 'history', id, days] as const,
  },
  GROUPS: {
    ALL: ['groups'] as const,
    LIST: (filters?: Record<string, unknown>) => ['groups', 'list', filters] as const,
    DETAIL: (id: string) => ['groups', id] as const,
    LESSONS: (id: string) => ['groups', id, 'lessons'] as const,
  },
  SCHEDULE: {
    ALL: ['schedule'] as const,
    RANGE: (filters: Record<string, unknown>) => ['schedule', filters] as const,
  },
  COURSES: {
    ALL: ['courses'] as const,
    LIST: (filters?: Record<string, unknown>) => ['courses', 'list', filters] as const,
    DETAIL: (id: string) => ['courses', id] as const,
    SUBJECTS: ['courses', 'subjects'] as const,
  },
  ATTENDANCE: {
    ALL: ['attendance'] as const,
    LESSON: (lessonId: string) => ['attendance', 'lesson', lessonId] as const,
    STUDENT: (studentId: string) => ['attendance', 'student', studentId] as const,
  },
  FINANCE: {
    ALL: ['finance'] as const,
    SUMMARY: ['finance', 'summary'] as const,
    ACCOUNTS: ['finance', 'accounts'] as const,
    PAYMENTS: (filters?: Record<string, unknown>) => ['finance', 'payments', filters] as const,
    EXPENSES: (filters?: Record<string, unknown>) => ['finance', 'expenses', filters] as const,
    EXPENSE_CATEGORIES: ['finance', 'expense-categories'] as const,
  },
  PAYROLL: {
    ALL: ['payroll'] as const,
    CALCULATIONS: (filters?: Record<string, unknown>) => ['payroll', 'calculations', filters] as const,
    SCHEMES: (filters?: Record<string, unknown>) => ['payroll', 'schemes', filters] as const,
  },
  GAMIFICATION: {
    ALL: ['gamification'] as const,
    TRANSACTIONS: (filters?: Record<string, unknown>) => ['gamification', 'transactions', filters] as const,
    ITEMS: ['gamification', 'items'] as const,
    ITEMS_LIST: (includeInactive: boolean) => ['gamification', 'items', { includeInactive }] as const,
    ORDERS: (filters?: Record<string, unknown>) => ['gamification', 'orders', filters] as const,
  },
  STAFF: {
    ALL: ['staff'] as const,
    LIST: (filters?: Record<string, unknown>) => ['staff', 'list', filters] as const,
    DETAIL: (id: string) => ['staff', id] as const,
    ROLES: ['staff', 'roles'] as const,
  },
  NOTIFICATIONS: {
    ALL: ['notifications'] as const,
    TEMPLATES: ['notifications', 'templates'] as const,
    SMS_LOGS: (filters?: Record<string, unknown>) => ['notifications', 'sms', filters] as const,
  },
  REPORTS: {
    ALL: ['reports'] as const,
    MONTHLY: (period?: string) => ['reports', 'monthly', period] as const,
  },
} as const
