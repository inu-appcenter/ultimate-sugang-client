import type { SukangApi } from '@/features/sukang/api/types'
import { SukangError } from '@/features/sukang/api/types'
import {
  ALL_COURSES,
  BASKET_COURSES,
  GYOYANG_COURSES,
  HUSS_COURSES,
  INITIAL_ENROLLED_COURSES,
  JUNGONG_COURSES,
  STUDENT_FIXTURE,
  YUNGAE_COURSES,
} from '@/features/sukang/api/mock/fixtures'
import { resolveCourseType, validateEnroll } from '@/features/sukang/api/mock/validate'
import { cptnGbnName, fldGnbName } from '@/features/sukang/constants/codes'
import type { Course, EnrollmentRow, Student } from '@/features/sukang/schemas'
import { randomDelay } from '@/shared/api/delay'
import { env } from '@/shared/config/env'

/**
 * D1 mock 어댑터: 인메모리 픽스처 + 서버 지연(원§12 200~800ms) + 서버 검증 시뮬레이션(02 §4-1) + 이수구분 파생(02 §4-2).
 * 동시 경쟁·대기열·서버 시계·실패율은 시뮬레이션하지 않는다(02 §6, 백엔드 범위).
 * `VITE_MOCK_FAIL=session` 이면 신청/취소가 SESSION_EXPIRED 를 던진다(Q-13 흐름 수동 검증용).
 */
const DELAY_MS = { min: 200, max: 800 } as const

/** 학번별 신청내역(모듈 싱글턴 — 새로고침 시 초기화) */
const enrollmentsByStudent = new Map<string, EnrollmentRow[]>()

const studentOf = (id: string): Student => ({ id, ...STUDENT_FIXTURE })

function enrollmentsOf(studentId: string): EnrollmentRow[] {
  const existing = enrollmentsByStudent.get(studentId)
  if (existing) return existing
  const student = studentOf(studentId)
  const seeded = INITIAL_ENROLLED_COURSES.map((course, i) => ({
    studentId,
    courseId: course.id,
    resolvedType: resolveCourseType(student, course),
    reAttendance: '',
    createdAt: new Date(Date.now() - (INITIAL_ENROLLED_COURSES.length - i) * 60_000).toISOString(),
    course,
  }))
  enrollmentsByStudent.set(studentId, seeded)
  return seeded
}

async function simulate<T>(fn: () => T): Promise<T> {
  await randomDelay(DELAY_MS.min, DELAY_MS.max)
  return fn()
}

function assertSessionAlive(): void {
  if (env.VITE_MOCK_FAIL === 'session') throw new SukangError('SESSION_EXPIRED')
}

function findCourse(courseId: string): Course {
  const course = ALL_COURSES.find((c) => c.id === courseId)
  if (!course) throw new Error(`mock: 알 수 없는 courseId ${courseId}`)
  return course
}

export const mockApi: SukangApi = {
  getStudent: (studentId) => simulate(() => studentOf(studentId)),

  listBasket: () => simulate(() => [...BASKET_COURSES]),

  listJungong: () => simulate(() => [...JUNGONG_COURSES]),

  listGyoyang: ({ cptnGbn, fldGnb }) =>
    simulate(() => {
      const typeName = cptnGbnName(cptnGbn)
      if (!typeName) return []
      const areaName = fldGnb ? fldGnbName(cptnGbn, fldGnb) : undefined
      return GYOYANG_COURSES.filter(
        (c) => c.courseType === typeName && (areaName === undefined || c.courseArea === areaName),
      )
    }),

  /** 코드값 미제공(Q-14) → 학과(부) 이름이 곧 값 */
  listTagwa: ({ tagwaCd }) => simulate(() => ALL_COURSES.filter((c) => c.department === tagwaCd)),

  listYungae: ({ yungaeCd }) => simulate(() => [...(YUNGAE_COURSES[yungaeCd] ?? [])]),

  listHuss: () => simulate(() => [...HUSS_COURSES]),

  /** 과목명 또는 학수번호 부분 일치(서버 판단 영역 — mock 근사) */
  searchCourses: ({ q }) =>
    simulate(() => ALL_COURSES.filter((c) => c.name.includes(q) || c.code.includes(q))),

  listEnrollments: (studentId) =>
    simulate(() =>
      [...enrollmentsOf(studentId)].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    ),

  enroll: ({ studentId, courseId }) =>
    simulate(() => {
      assertSessionAlive()
      const student = studentOf(studentId)
      const course = findCourse(courseId)
      const rows = enrollmentsOf(studentId)
      validateEnroll(
        student,
        course,
        rows.map((r) => r.course),
      )
      rows.push({
        studentId,
        courseId: course.id,
        resolvedType: resolveCourseType(student, course),
        reAttendance: '',
        createdAt: new Date().toISOString(),
        course,
      })
      return { course }
    }),

  cancel: ({ studentId, courseId }) =>
    simulate(() => {
      assertSessionAlive()
      const rows = enrollmentsOf(studentId)
      const idx = rows.findIndex((r) => r.courseId === courseId)
      if (idx >= 0) rows.splice(idx, 1)
    }),
}
