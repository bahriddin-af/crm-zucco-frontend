export type SupportedLanguage = 'uz-Cyrl' | 'uz' | 'ru' | 'en'

export interface LanguageOption {
  code: SupportedLanguage
  label: string
  shortLabel: string
  flag: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'uz-Cyrl', label: 'Ўзбекча (Кирилл)', shortLabel: 'ЎЗБ', flag: '🇺🇿' },
  { code: 'uz', label: "O'zbekcha (Lotin)", shortLabel: 'OʻZB', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', shortLabel: 'РУС', flag: '🇷🇺' },
  { code: 'en', label: 'English', shortLabel: 'ENG', flag: '🇺🇸' },
]

export interface Translations {
  common: {
    search: string
    save: string
    cancel: string
    confirm: string
    create: string
    edit: string
    delete: string
    filter: string
    all: string
    active: string
    frozen: string
    debt: string
    status: string
    actions: string
    date: string
    amount: string
    phone: string
    comment: string
    offline: string
    reload: string
    noData: string
    loading: string
    sumUnit: string
    coinsUnit: string
    studentUnit: string
    total: string
    submitting: string
  }
  nav: {
    mainSection: string
    overview: string
    receptionSection: string
    leads: string
    students: string
    smsCenter: string
    academicSection: string
    courses: string
    groups: string
    schedule: string
    attendance: string
    financeSection: string
    financeDesk: string
    expenses: string
    payroll: string
    staff: string
    reports: string
    incentiveSection: string
    rewardMarket: string
    coinHistory: string
    managementSection: string
    branches: string
    settings: string
    roles: string
  }
  overview: {
    title: string
    subtitle: string
    activeStudents: string
    monthlyRevenue: string
    avgAttendance: string
    debt: string
    vsLastMonth: string
    planProgress: string
    todayLessons: string
    debtCount: string
    fullSchedule: string
    funnelState: string
    goToFunnel: string
  }
  leads: {
    title: string
    subtitle: string
    addNew: string
    searchPlaceholder: string
    totalLeads: string
    convertToStudent: string
    stages: {
      new: string
      contacted: string
      trialScheduled: string
      trialAttended: string
      waitingList: string
      converted: string
      lost: string
    }
    convertModalTitle: string
    convertModalDesc: string
    linkExisting: string
    linkExistingNote: string
    selectGroup: string
    startDate: string
    customPrice: string
    confirmConvert: string
    lostModalTitle: string
    lostReason: string
    lostNotes: string
    markLost: string
  }
  students: {
    title: string
    subtitle: string
    addNew: string
    searchPlaceholder: string
    codeOrName: string
    balance: string
    coins: string
    enrolledGroups: string
    freeze: string
    enrollGroup: string
    freezeModalTitle: string
    freezeNote: string
    freezeStartDate: string
    freezeEndDate: string
    freezeReason: string
    freezeConfirm: string
    profileTitle: string
    backToList: string
    paymentsTab: string
    attendanceTab: string
    coinsTab: string
    timelineTab: string
  }
  finance: {
    title: string
    subtitle: string
    totalBalance: string
    recordExpense: string
    acceptPayment: string
    receiptNo: string
    accountAndMethod: string
    expensesTitle: string
    payrollTitle: string
    payrollSubtitle: string
    calculatePayroll: string
    approve: string
    payFromCash: string
    paidFinished: string
    drawerTitle: string
    drawerDesc: string
    paymentMethod: string
    amountToPay: string
    cashAccount: string
    billingPeriod: string
    printReceipt: string
    confirmPayment: string
  }
  attendance: {
    title: string
    subtitle: string
    saveAttendance: string
    selectGroup: string
    lessonDate: string
    present: string
    late: string
    excused: string
    unexcused: string
    score: string
    coinsAndBonus: string
    savedSuccess: string
  }
  auth: {
    title: string
    subtitle: string
    phone: string
    password: string
    loginButton: string
    quickLogin: string
    ownerRole: string
    teacherRole: string
    cashierRole: string
    successMessage: string
  }
}
