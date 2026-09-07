import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { sukangApi } from '@/features/sukang/api'
import type { ScreenKey } from '@/features/sukang/constants/screens'
import { sukangKeys } from '@/features/sukang/queryKeys'
import type { Course } from '@/features/sukang/schemas'
import { useSessionStore } from '@/shared/session/store'

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

export function useStudent() {
  const studentId = useStudentId()
  return useQuery({
    queryKey: sukangKeys.student(studentId ?? ''),
    queryFn: () => sukangApi.getStudent(studentId ?? ''),
    enabled: studentId !== null,
  })
}

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

export function useEnrollments() {
  const studentId = useStudentId()
  return useQuery({
    queryKey: sukangKeys.enrollments(studentId ?? ''),
    queryFn: () => sukangApi.listEnrollments(studentId ?? ''),
    enabled: studentId !== null,
  })
}

function useEnrollmentMutation<T>(
  request: (params: { studentId: string; courseId: string }) => Promise<T>,
) {
  const queryClient = useQueryClient()
  const studentId = useStudentId()
  return useMutation({
    mutationFn: (courseId: string) =>
      studentId === null
        ? Promise.reject(new Error('세션 없음'))
        : request({ studentId, courseId }),
    // enrollments 만 갱신한다 — courses(조회 목록)는 그대로 → .claude/spec/convention/01_data.md §7
    onSuccess: () => {
      if (studentId !== null)
        void queryClient.invalidateQueries({ queryKey: sukangKeys.enrollments(studentId) })
    },
  })
}

export const useEnroll = () => useEnrollmentMutation((p) => sukangApi.enroll(p))

export const useCancel = () => useEnrollmentMutation((p) => sukangApi.cancel(p))

export function useSearchSubmit<K extends ScreenKey>(screen: K) {
  const queryClient = useQueryClient()
  const [submitted, setSubmitted] = useState<CourseParams<K> | null>(null)
  const submit = (params: CourseParams<K>) => {
    if (submitted !== null && JSON.stringify(submitted) === JSON.stringify(params)) {
      void queryClient.invalidateQueries({ queryKey: sukangKeys.courses(screen, submitted) })
      return
    }
    setSubmitted(params)
  }
  return { submitted, submit }
}
