import { ZodError, type ZodType } from 'zod'
import { getAdapter } from '@/features/sukang/api/index'
import { SukangError, type SukangApi } from '@/features/sukang/api/types'
import {
  CourseListSchema,
  EnrollResultSchema,
  EnrollmentRowListSchema,
  StudentSchema,
} from '@/features/sukang/schemas'

/**
 * 03 §3-1: 화면·훅은 이 `sukangApi` 만 호출한다. 모든 어댑터 출력은 Zod parse 후 사용(mock 도 예외 없음).
 * parse 실패 → SukangError('SCHEMA'). 어댑터가 던진 SukangError 는 그대로 전파.
 */
const adapter = getAdapter()

async function parsed<T>(schema: ZodType<T>, result: Promise<unknown>): Promise<T> {
  const raw = await result
  try {
    return schema.parse(raw)
  } catch (e) {
    if (e instanceof ZodError)
      throw new SukangError('SCHEMA', '응답이 스키마와 일치하지 않습니다', { cause: e })
    throw e
  }
}

export const sukangApi: SukangApi = {
  getStudent: (studentId) => parsed(StudentSchema, adapter.getStudent(studentId)),
  listBasket: (studentId) => parsed(CourseListSchema, adapter.listBasket(studentId)),
  listJungong: (studentId) => parsed(CourseListSchema, adapter.listJungong(studentId)),
  listGyoyang: (p) => parsed(CourseListSchema, adapter.listGyoyang(p)),
  listTagwa: (p) => parsed(CourseListSchema, adapter.listTagwa(p)),
  listYungae: (p) => parsed(CourseListSchema, adapter.listYungae(p)),
  listHuss: () => parsed(CourseListSchema, adapter.listHuss()),
  searchCourses: (p) => parsed(CourseListSchema, adapter.searchCourses(p)),
  listEnrollments: (studentId) =>
    parsed(EnrollmentRowListSchema, adapter.listEnrollments(studentId)),
  enroll: (p) => parsed(EnrollResultSchema, adapter.enroll(p)),
  cancel: (p) => adapter.cancel(p),
}
