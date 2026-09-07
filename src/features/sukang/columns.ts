import type { ScreenKey } from '@/features/sukang/constants/screens'

// 폭 합 1378 고정 — 컬럼을 빼거나 폭을 바꾸면 교과목명 폭이 함께 움직인다 → .claude/spec/convention/02_ui.md §7
export type ColumnKey =
  | 'no'
  | 'grade'
  | 'courseType'
  | 'courseArea'
  | 'code'
  | 'title'
  | 'credits'
  | 'en'
  | 'schedule'
  | 'department'
  | 'reAttendance'
  | 'professor'
  | 'action'

export interface ColumnDef {
  key: ColumnKey
  ko: string
  en?: string
  width: number | null
}

export const TABLE_TOTAL_WIDTH = 1378

// 없으면 fixed 레이아웃이 7등분한다 → .claude/spec/convention/02_ui.md §2
export const PER_TABLE_COL_WIDTHS = ['22%', '12%', '14%', '12%', '14%', '12%', '14%'] as const

const COL = {
  no: { key: 'no', ko: '순번', en: 'No', width: 35 },
  grade: { key: 'grade', ko: '학년', en: 'Grade', width: 50 },
  courseType: { key: 'courseType', ko: '이수구분', en: 'Course Type', width: 70 },
  courseArea: { key: 'courseArea', ko: '이수영역', en: 'Course Area', width: 125 },
  code: { key: 'code', ko: '학수번호', en: 'Course No', width: 80 },
  title: { key: 'title', ko: '교과목명', en: 'Course Title', width: 0 },
  credits: { key: 'credits', ko: '학점', en: 'Credit', width: 50 },
  en: { key: 'en', ko: '원어여부', en: 'EN', width: 65 },
  schedule: { key: 'schedule', ko: '요일 및 교시(강의실)', width: 250 },
  department: { key: 'department', ko: '개설학과', en: 'Dpt', width: 125 },
  reAttendance: {
    key: 'reAttendance',
    ko: '재수강 구분',
    en: 'Re-Att.Class',
    width: 100,
  },
  // 서버가 항상 빈 값을 주지만 컬럼·폭 80 은 유지한다 → .claude/spec/convention/02_ui.md §7
  professor: { key: 'professor', ko: '교강사', en: 'Prof', width: 80 },
  enroll: { key: 'action', ko: '신청', width: 65 },
  cancel: { key: 'action', ko: '취소', width: 65 },
} satisfies Record<string, ColumnDef>

type ColId = keyof typeof COL

function build(ids: readonly ColId[]): readonly ColumnDef[] {
  const fixedWidthTotal = ids
    .filter((id) => id !== 'title')
    .reduce((sum, id) => sum + (COL[id].width ?? 0), 0)
  return ids.map((id) =>
    id === 'title' ? { ...COL.title, width: TABLE_TOTAL_WIDTH - fixedWidthTotal } : { ...COL[id] },
  )
}

export const SCREEN_COLUMNS: Record<ScreenKey, readonly ColumnDef[]> = {
  Basket: build([
    'grade',
    'courseType',
    'code',
    'title',
    'credits',
    'en',
    'schedule',
    'department',
    'professor',
    'enroll',
  ]),
  Jungong: build([
    'grade',
    'courseType',
    'code',
    'title',
    'credits',
    'en',
    'schedule',
    'department',
    'professor',
    'enroll',
  ]),
  Gyoyang: build([
    'courseType',
    'courseArea',
    'code',
    'title',
    'credits',
    'en',
    'schedule',
    'professor',
    'enroll',
  ]),
  Tagwa: build([
    'grade',
    'courseType',
    'code',
    'title',
    'credits',
    'en',
    'schedule',
    'professor',
    'enroll',
  ]),
  Yungae: build(['grade', 'code', 'title', 'credits', 'en', 'schedule', 'professor', 'enroll']),
  Huss: build([
    'grade',
    'code',
    'title',
    'credits',
    'en',
    'schedule',
    'department',
    'professor',
    'enroll',
  ]),
  Custom: build([
    'grade',
    'courseType',
    'code',
    'title',
    'credits',
    'en',
    'schedule',
    'department',
    'professor',
    'enroll',
  ]),
}

const ENROLLMENT_OVERRIDES: Partial<Record<ColId, Partial<ColumnDef>>> = {
  title: { width: null },
  schedule: { en: 'Time Table(Lecture room)' },
  department: { ko: '개설학과(부)' },
  cancel: { en: 'Cancel' },
}

export const ENROLLMENT_COLUMNS: readonly ColumnDef[] = (
  [
    'no',
    'courseType',
    'code',
    'title',
    'credits',
    'en',
    'schedule',
    'department',
    'reAttendance',
    'professor',
    'cancel',
  ] as const
).map((id): ColumnDef => ({ ...COL[id], ...ENROLLMENT_OVERRIDES[id] }))
