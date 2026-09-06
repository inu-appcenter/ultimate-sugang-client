import { SukangError } from '@/features/sukang/api/types'
import { CPTN_GBN } from '@/features/sukang/constants/codes'
import type { Course, Student } from '@/features/sukang/schemas'

/**
 * 서버 검증 시뮬레이션(mock 전용, 03 §3-3). 실 규칙은 백엔드 몫 — 여기서는 02 §4-1 순서만 재현한다.
 */

const DAY_TOKENS = new Set(['월', '화', '수', '목', '금', '토', '일'])

/**
 * 시간표 문자열(01 §3-4 문법) → `요일:교시` 토큰 집합.
 * 범위(`5B-6`, `7-8A`)는 정수 교시로 확장하고 A/B 접미는 무시한다(mock 근사). 강의실 `(…)` 은 건너뜀.
 */
export function scheduleSlots(schedule: readonly string[]): Set<string> {
  const slots = new Set<string>()
  for (const line of schedule) {
    let day: string | null = null
    for (const tok of line.split(/\s+/).filter(Boolean)) {
      if (DAY_TOKENS.has(tok)) {
        day = tok
        continue
      }
      if (tok.startsWith('(') || day === null) continue
      const m = /^(\d+)[AB]?(?:-(\d+)[AB]?)?$/.exec(tok)
      const from = m?.[1]
      if (!from) continue
      const start = Number(from)
      const end = m?.[2] ? Number(m[2]) : start
      for (let p = start; p <= end; p += 1) slots.add(`${day}:${p}`)
    }
  }
  return slots
}

export function hasTimeConflict(a: Course, b: Course): boolean {
  const sa = scheduleSlots(a.schedule)
  for (const slot of scheduleSlots(b.schedule)) if (sa.has(slot)) return true
  return false
}

/**
 * 02 §4-1 검증 순서(CAPTCHA 는 D3 미구현):
 * 시간표 중복 DUP_TIME → 동일 과목명 DUP_SUBJECT(시간 미겹침에도 차단, 독립) → 학점 상한 CREDIT_EXCEEDED → 정원 CLASS_FULL.
 */
export function validateEnroll(
  student: Student,
  course: Course,
  enrolled: readonly Course[],
): void {
  if (enrolled.some((e) => hasTimeConflict(e, course))) throw new SukangError('DUP_TIME')
  if (enrolled.some((e) => e.name === course.name)) throw new SukangError('DUP_SUBJECT')
  const total = enrolled.reduce((sum, e) => sum + e.credits, 0) + course.credits
  if (total > student.creditLimit) throw new SukangError('CREDIT_EXCEEDED')
  if (course.isClosed) throw new SukangError('CLASS_FULL')
}

const GYOYANG_TYPES = new Set(CPTN_GBN.map((o) => o.name))

/**
 * 02 §4-2 이수구분 파생(학생 소속 × 개설학과) — mock 전용 근사(원§10.2 관측 1건: 타학과 전공 → 일반선택).
 * 교양 계열(02 §5-1 이수구분 6종)은 소속과 무관하므로 그대로 둔다. 실 규칙은 백엔드(Q-14).
 */
export function resolveCourseType(student: Student, course: Course): string {
  if (GYOYANG_TYPES.has(course.courseType)) return course.courseType
  return course.department === student.department ? course.courseType : '일반선택'
}
