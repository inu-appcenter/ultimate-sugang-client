import { SukangError } from '@/features/sukang/api/types'
import { MAJOR_COURSE_TYPES, type CourseType } from '@/features/sukang/constants/codes'
import type { Course, Student } from '@/features/sukang/schemas'

const DAY_TOKENS = new Set(['월', '화', '수', '목', '금', '토', '일'])
const PERIOD_TOKEN =
  /^(?<night>야)?(?<start>\d+)(?<startHalf>[AB])?(?:-(?:야)?(?<end>\d+)(?<endHalf>[AB])?)?$/

interface HalfPeriodRange {
  isNight: boolean
  from: number
  to: number
}

const firstHalfOf = (period: number) => period * 2 - 1
const lastHalfOf = (period: number) => period * 2

function endHalfIndex(groups: Record<string, string | undefined>, startPeriod: number): number {
  if (groups.end !== undefined) {
    const endPeriod = Number(groups.end)
    return groups.endHalf === 'A' ? firstHalfOf(endPeriod) : lastHalfOf(endPeriod)
  }
  return groups.startHalf === 'A' ? firstHalfOf(startPeriod) : lastHalfOf(startPeriod)
}

function parsePeriodToken(token: string): HalfPeriodRange | null {
  const groups = PERIOD_TOKEN.exec(token)?.groups
  if (groups?.start === undefined) return null
  const startPeriod = Number(groups.start)
  return {
    isNight: groups.night !== undefined,
    from: groups.startHalf === 'B' ? lastHalfOf(startPeriod) : firstHalfOf(startPeriod),
    to: endHalfIndex(groups, startPeriod),
  }
}

// 시간표는 반교시 단위로 비교한다 → .claude/spec/convention/04_mock.md §3.2
export function scheduleSlots(schedule: string): Set<string> {
  const slots = new Set<string>()
  let day: string | null = null

  for (const token of schedule.split(/\s+/).filter(Boolean)) {
    if (DAY_TOKENS.has(token)) {
      day = token
      continue
    }
    const isLectureRoom = token.startsWith('(')
    if (isLectureRoom || day === null) continue

    const range = parsePeriodToken(token)
    if (!range) continue

    const nightMark = range.isNight ? '야' : ''
    for (let half = range.from; half <= range.to; half += 1) slots.add(`${day}:${nightMark}${half}`)
  }
  return slots
}

export function hasTimeConflict(course: Course, other: Course): boolean {
  const slots = scheduleSlots(course.schedule)
  for (const slot of scheduleSlots(other.schedule)) if (slots.has(slot)) return true
  return false
}

// 검증 순서 고정(시간중복 → 동일과목명 → 학점 → 정원) → .claude/spec/convention/04_mock.md §3.1
export function validateEnroll(
  student: Student,
  course: Course,
  enrolled: readonly Course[],
): void {
  if (enrolled.some((taken) => hasTimeConflict(taken, course))) throw new SukangError('DUP_TIME')
  if (enrolled.some((taken) => taken.name === course.name)) throw new SukangError('DUP_SUBJECT')
  const totalCredits = enrolled.reduce((sum, taken) => sum + taken.credits, 0) + course.credits
  if (totalCredits > student.creditLimit) throw new SukangError('CREDIT_EXCEEDED')
  if (course.isClosed) throw new SukangError('CLASS_FULL')
}

// 실 규칙은 백엔드 소관 — 여기서는 근사 → .claude/spec/convention/04_mock.md §3.3
export function resolveCourseType(student: Student, course: Course): CourseType {
  if (course.department === student.department) return course.courseType
  if (MAJOR_COURSE_TYPES.includes(course.courseType)) return '일반선택'
  return course.courseType
}

export function creditLimitFor(gpa: number): number {
  if (gpa >= 4.0) return 24
  if (gpa >= 3.5) return 21
  return 20
}
