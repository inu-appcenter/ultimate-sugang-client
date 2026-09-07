import { ZodError, type ZodType } from 'zod'
import { getAdapter } from '@/features/sukang/api/index'
import { SukangError, type SukangApi } from '@/features/sukang/api/types'
import {
  CourseListSchema,
  EnrollResultSchema,
  EnrollmentRowListSchema,
  StudentSchema,
} from '@/features/sukang/schemas'

const adapter = getAdapter()

// 모든 어댑터 출력은 Zod parse 후 사용 → .claude/spec/convention/01_data.md §1
async function parsed<T>(schema: ZodType<T>, request: Promise<unknown>): Promise<T> {
  const raw = await request
  try {
    return schema.parse(raw)
  } catch (error) {
    if (error instanceof ZodError)
      throw new SukangError('SCHEMA', '응답이 스키마와 일치하지 않습니다', { cause: error })
    throw error
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
