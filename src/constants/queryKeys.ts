export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  BRANCHES: {
    ALL: ['branches'] as const,
    DETAIL: (id: string) => ['branches', id] as const,
    ROOMS: (branchId: string) => ['branches', branchId, 'rooms'] as const,
  },
  LEADS: {
    ALL: ['leads'] as const,
    LIST: (filters?: Record<string, unknown>) => ['leads', 'list', filters] as const,
    DETAIL: (id: string) => ['leads', id] as const,
  },
  STUDENTS: {
    ALL: ['students'] as const,
    LIST: (filters?: Record<string, unknown>) => ['students', 'list', filters] as const,
    DETAIL: (id: string) => ['students', id] as const,
    GROUPS: (id: string) => ['students', id, 'groups'] as const,
  },
  GROUPS: {
    ALL: ['groups'] as const,
    LIST: (filters?: Record<string, unknown>) => ['groups', 'list', filters] as const,
    DETAIL: (id: string) => ['groups', id] as const,
    SCHEDULE: (id: string) => ['groups', id, 'schedule'] as const,
  },
  COURSES: {
    ALL: ['courses'] as const,
    LIST: (filters?: Record<string, unknown>) => ['courses', 'list', filters] as const,
    DETAIL: (id: string) => ['courses', id] as const,
  },
  ATTENDANCE: {
    LESSON: (lessonId: string) => ['attendance', 'lesson', lessonId] as const,
  },
  FINANCE: {
    ACCOUNTS: ['finance', 'accounts'] as const,
    TRANSACTIONS: (filters?: Record<string, unknown>) => ['finance', 'transactions', filters] as const,
    BILLING_PREVIEW: (period: string) => ['finance', 'billing-preview', period] as const,
  },
  PAYROLL: {
    LIST: (period?: string) => ['payroll', 'list', period] as const,
    SCHEMES: ['payroll', 'schemes'] as const,
  },
  GAMIFICATION: {
    BALANCE: (studentId: string) => ['gamification', 'balance', studentId] as const,
    TRANSACTIONS: (filters?: Record<string, unknown>) => ['gamification', 'transactions', filters] as const,
    MARKET_ITEMS: ['gamification', 'items'] as const,
  },
  STAFF: {
    ALL: ['staff'] as const,
    DETAIL: (id: string) => ['staff', id] as const,
    ROLES: ['staff', 'roles'] as const,
  },
  NOTIFICATIONS: {
    SMS_HISTORY: (filters?: Record<string, unknown>) => ['notifications', 'sms', filters] as const,
  },
} as const
