/** 02 §5-7 메뉴 키 = 화면 식별자(01 §2-3). 배열 순서 = 탭 순서(원§2.1). */
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

/** 01 §2-4 검색 조건 패턴 3종(+조건 없음) */
export type SearchPattern = 'none' | 'select' | 'linked' | 'text'

export interface ScreenMeta {
  key: ScreenKey
  /** 탭 표기 ko / en (원§8.3) */
  tabKo: string
  tabEn: string
  /** 화면 제목 원문 — `>>` 접두 포함(원§8.4). 탭 이름과 미묘하게 다름(01 §2-3 주석). */
  title: string
  search: SearchPattern
  /** 안내 영역 유무(01 §4) */
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

/** D20: 초기 탭 = 첫 탭. `?menu` 무효값도 Basket. */
export const DEFAULT_SCREEN: ScreenKey = 'Basket'

export const isScreenKey = (v: unknown): v is ScreenKey =>
  typeof v === 'string' && (SCREEN_KEYS as readonly string[]).includes(v)

export const toScreenKey = (v: unknown): ScreenKey => (isScreenKey(v) ? v : DEFAULT_SCREEN)

/** 원§8.3 탭 우측 주의 문구(평문, 05 §3-2) */
export const TAB_CAUTION_TEXT =
  '※ 주의(전공) : 검정색→주간학과 수업 / 고동색→야간학과 / 회색→마감강좌'

/** 01 §3-6 학기 타이틀(줄바꿈 병기, th-en 없음 — 05 §3-1) */
export const SEMESTER_TITLE = {
  ko: '2026년도 2학기 수강신청',
  en: '2026 Fall course registration',
} as const

/** 원§5.2 perT 라벨 ko / en */
export const PER_TABLE_LABELS = {
  department: { ko: '학과(부)', en: 'Department' },
  idName: { ko: '학번/성명', en: 'ID/Name' },
  gradeStatus: { ko: '학년/학적상태', en: 'Grade' },
} as const

/** 원§8.7 신청내역 헤더 문구 — 오탈자 `registrered` 원문 유지(D5) */
export const ENROLLMENT_HEADER_TEXT =
  '수강신청내역 List of Courses registrered ( * 삭제시 삭제할 과목의 취소버튼을 클릭하세요. )'

/** 출력 버튼 라벨(원§2.1·05 §6) — 동작은 Q-5 전 없음 */
export const PRINT_BUTTON_LABELS = {
  check: { ko: '확인서출력', en: 'Print Confirmation' },
  apply: { ko: '시간표출력', en: 'Print Time table' },
} as const

/** 원§8.5 조회 버튼 라벨 */
export const SEARCH_BUTTON_LABEL = '조회 (Search)'
