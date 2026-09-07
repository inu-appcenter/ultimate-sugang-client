export const SCREEN_KEYS = [
  'Basket',
  'Jungong',
  'Gyoyang',
  'Tagwa',
  'Yungae',
  'Huss',
  'Custom',
] as const
export type ScreenKey = (typeof SCREEN_KEYS)[number]

export type SearchPattern = 'none' | 'select' | 'linked' | 'text'

export interface ScreenMeta {
  key: ScreenKey
  tabKo: string
  tabEn: string
  title: string
  search: SearchPattern
  hasNotice: boolean
}

export const SCREENS: Record<ScreenKey, ScreenMeta> = {
  Basket: {
    key: 'Basket',
    tabKo: '장바구니',
    tabEn: 'Cart',
    title: '>> 장바구니',
    search: 'none',
    hasNotice: false,
  },
  Jungong: {
    key: 'Jungong',
    tabKo: '전공과목',
    tabEn: 'Major',
    title: '>> 전공과목',
    search: 'none',
    hasNotice: true,
  },
  Gyoyang: {
    key: 'Gyoyang',
    tabKo: '교양과목',
    tabEn: 'Liberal Arts',
    title: '>> 교양과목',
    search: 'linked',
    hasNotice: true,
  },
  Tagwa: {
    key: 'Tagwa',
    tabKo: '타학과과목',
    tabEn: 'Other Major',
    title: '>> 타학과과목',
    search: 'select',
    hasNotice: true,
  },
  Yungae: {
    key: 'Yungae',
    tabKo: '연계전공과목',
    tabEn: 'Interdisciplinary Courses',
    title: '>> 연계전공과목',
    search: 'select',
    hasNotice: true,
  },
  Huss: {
    key: 'Huss',
    tabKo: 'HUSS전공과목',
    tabEn: 'HUSS Courses',
    title: '>> HUSS과목',
    search: 'none',
    hasNotice: false,
  },
  Custom: {
    key: 'Custom',
    tabKo: '과목명(코드) 조회',
    tabEn: 'Search by Course Title(Code)',
    title: '>> 과목명(코드)조회',
    search: 'text',
    hasNotice: true,
  },
}

export const isScreenKey = (v: unknown): v is ScreenKey =>
  typeof v === 'string' && (SCREEN_KEYS as readonly string[]).includes(v)

export const toScreenKey = (v: unknown): ScreenKey | null => (isScreenKey(v) ? v : null)

export const screenLabelOf = (meta: ScreenMeta): string => meta.title.replace(/^>>\s*/, '')

export const TAB_CAUTION = {
  head: '※ 주의(전공) : 검정색→주간학과 수업 / ',
  night: '고동색→야간학과',
  sep: ' / ',
  closed: '회색→마감강좌',
} as const

export const SEMESTER_TITLE = {
  ko: '2026년도 2학기 수강신청',
  en: '2026 Fall course registration',
} as const

export const PER_TABLE_LABELS = {
  department: { ko: '학과(부)', en: 'Department' },
  idName: { ko: '학번/성명', en: 'ID/Name' },
  gradeStatus: { ko: '학년/학적상태', en: 'Grade' },
} as const

export const ENROLLMENT_TITLE = {
  ko: '수강신청내역',
  en: 'List of Courses registrered',
  hint: '( * 삭제시 삭제할 과목의 취소버튼을 클릭하세요. )',
} as const

export const PRINT_BUTTON_LABELS = {
  check: { ko: '확인서출력', en: 'Print Confirmation' },
  apply: { ko: '시간표출력', en: 'Print Time table' },
} as const

export const SEARCH_BUTTON_LABEL = '조회 (Search)'
