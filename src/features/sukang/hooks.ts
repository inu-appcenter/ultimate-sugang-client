import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sukangApi } from '@/features/sukang/api'
import type { ScreenKey } from '@/features/sukang/constants/screens'
import { sukangKeys } from '@/features/sukang/queryKeys'
import type { Course } from '@/features/sukang/schemas'
import { useSessionStore } from '@/shared/session/store'

/** 화면별 조회 파라미터(03 §3-2 O-2~O-8). 조건 없음 화면은 빈 객체. */
export interface CourseParamsMap {
  Basket: Record<string, never>
  Jungong: Record<string, never>
  Huss: Record<string, never>
  Gyoyang: { cptnGbn: string; fldGnb?: string }
  Tagwa: { tagwaCd: string }
  Yungae: { yungaeCd: string }
  Custom: { q: string }
}
export type CourseParams<K extends ScreenKey> = CourseParamsMap[K]

const fetchers: {
  [K in ScreenKey]: (params: CourseParamsMap[K], studentId: string) => Promise<Course[]>
} = {
  Basket: (_p, studentId) => sukangApi.listBasket(studentId),
  Jungong: (_p, studentId) => sukangApi.listJungong(studentId),
  Huss: () => sukangApi.listHuss(),
  Gyoyang: (p) => sukangApi.listGyoyang(p),
  Tagwa: (p) => sukangApi.listTagwa(p),
  Yungae: (p) => sukangApi.listYungae(p),
  Custom: (p) => sukangApi.searchCourses(p),
}

export const useStudentId = (): string | null => useSessionStore((s) => s.studentId)

/** O-1 학생 정보(perT) */
export function useStudent() {
  const studentId = useStudentId()
  return useQuery({
    queryKey: sukangKeys.student(studentId ?? ''),
    queryFn: () => sukangApi.getStudent(studentId ?? ''),
    enabled: studentId !== null,
  })
}

/**
 * 03 §5-5 조회 트리거: 조건 없음 화면은 `params = {}` 로 즉시, 조건 있는 화면은 [조회] 후 `submitted` 를 넘긴다.
 * `params === null` 이면 요청하지 않는다(D19 미충족 no-op 와 결합).
 */
export function useCourseList<K extends ScreenKey>(
  screen: K,
  params: CourseParams<K> | null,
  enabled = true,
) {
  const studentId = useStudentId()
  return useQuery({
    queryKey: sukangKeys.courses(screen, params),
    queryFn: () => {
      if (params === null || studentId === null) return Promise.resolve<Course[]>([])
      return fetchers[screen](params, studentId)
    },
    enabled: enabled && params !== null && studentId !== null,
  })
}

/** O-9 신청내역 — 스크롤 없이 전건 */
export function useEnrollments() {
  const studentId = useStudentId()
  return useQuery({
    queryKey: sukangKeys.enrollments(studentId ?? ''),
    queryFn: () => sukangApi.listEnrollments(studentId ?? ''),
    enabled: studentId !== null,
  })
}

/** O-10 신청. 성공 → enrollments 만 invalidate(D4: courses 미갱신). alert 는 호출 측(03 §5-2). */
export function useEnroll() {
  const queryClient = useQueryClient()
  const studentId = useStudentId()
  return useMutation({
    mutationFn: (courseId: string) => {
      if (studentId === null) return Promise.reject(new Error('세션 없음'))
      return sukangApi.enroll({ studentId, courseId })
    },
    onSuccess: () => {
      if (studentId !== null)
        void queryClient.invalidateQueries({ queryKey: sukangKeys.enrollments(studentId) })
    },
  })
}

/** O-11 취소. 성공 → enrollments invalidate. confirm/alert 는 호출 측. */
export function useCancel() {
  const queryClient = useQueryClient()
  const studentId = useStudentId()
  return useMutation({
    mutationFn: (courseId: string) => {
      if (studentId === null) return Promise.reject(new Error('세션 없음'))
      return sukangApi.cancel({ studentId, courseId })
    },
    onSuccess: () => {
      if (studentId !== null)
        void queryClient.invalidateQueries({ queryKey: sukangKeys.enrollments(studentId) })
    },
  })
}

/** D9 4상태 — 원본 시각 유지: Loading/Error/Empty 는 thead 만, Data 만 행 렌더 */
export type TableStatus = 'loading' | 'error' | 'empty' | 'data'

export function tableStatusOf(q: {
  isPending: boolean
  isFetching: boolean
  isError: boolean
  data: readonly unknown[] | undefined
}): TableStatus {
  if (q.isError) return 'error'
  if (q.data === undefined) return q.isPending && q.isFetching ? 'loading' : 'empty'
  return q.data.length === 0 ? 'empty' : 'data'
}
