import type { ScreenKey } from '@/features/sukang/constants/screens'

/**
 * D10: 컬럼 폭은 디자인 토큰이 아니라 화면 설정 데이터(원§3). `<colgroup>` 에 px 로 적용한다.
 * 전체 1378px(전공과목 기준). 동일 컬럼은 화면이 달라도 같은 폭, 교과목명 = 1378 − 나머지 합(05 §4-5).
 * 명세 밖 컬럼 폭(init 도출): 이수영역 125 · 순번 50 · 재수강 구분 80 · 취소 65.
 * 라벨: 01 §5 매트릭스. en 누락 컬럼(요일 및 교시·액션)은 한글만(D21).
 */
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
  /** px — `<col style={{ width }}>` */
  width: number
}

export const TABLE_TOTAL_WIDTH = 1378

const COL = {
  no: { key: 'no', ko: '순번', en: 'No', width: 50 },
  grade: { key: 'grade', ko: '학년', en: 'Grade', width: 50 },
  courseType: { key: 'courseType', ko: '이수구분', en: 'Course Type', width: 70 },
  courseArea: { key: 'courseArea', ko: '이수영역', en: 'Course Area', width: 125 },
  code: { key: 'code', ko: '학수번호', en: 'Course No', width: 80 },
  /** 폭은 build() 가 잔여폭으로 채운다 */
  title: { key: 'title', ko: '교과목명', en: 'Course Title', width: 0 },
  credits: { key: 'credits', ko: '학점', en: 'Credit', width: 50 },
  en: { key: 'en', ko: '원어여부', en: 'EN', width: 65 },
  schedule: { key: 'schedule', ko: '요일 및 교시(강의실)', width: 250 },
  department: { key: 'department', ko: '개설학과', en: 'Dpt', width: 125 },
  reAttendance: { key: 'reAttendance', ko: '재수강 구분', en: 'Re-Att.Class', width: 80 },
  professor: { key: 'professor', ko: '교강사', en: 'Prof', width: 80 },
  enroll: { key: 'action', ko: '신청', width: 65 },
  cancel: { key: 'action', ko: '취소', width: 65 },
} satisfies Record<string, ColumnDef>

type ColId = keyof typeof COL

function build(ids: readonly ColId[]): readonly ColumnDef[] {
  const others = ids.filter((id) => id !== 'title').reduce((sum, id) => sum + COL[id].width, 0)
  return ids.map((id) =>
    id === 'title' ? { ...COL.title, width: TABLE_TOTAL_WIDTH - others } : { ...COL[id] },
  )
}

/** 01 §5 컬럼 매트릭스(원§3) — 화면별 컬럼 세트·순서 */
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

/** 신청내역 11컬럼(01 §5·05 §6) — 이수구분 = Enrollment.resolvedType */
export const ENROLLMENT_COLUMNS: readonly ColumnDef[] = build([
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
])
