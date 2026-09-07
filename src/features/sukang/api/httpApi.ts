import axios from 'axios'
import { z } from 'zod'
import { SukangError, type SukangApi, type SukangErrorCode } from '@/features/sukang/api/types'
import {
  CourseListSchema,
  CourseSchema,
  EnrollmentSchema,
  type EnrollmentRow,
  type Student,
} from '@/features/sukang/schemas'
import { getApiClient } from '@/shared/api/client'

// 서버↔프론트 모델 차이는 전부 이 파일에서 흡수 → .claude/spec/convention/01_data.md §5
const CourseListEnvelope = z.object({ courseResponses: CourseListSchema })

const EnrollEnvelope = z.object({ courseResponse: CourseSchema })

const ServerEnrollmentSchema = EnrollmentSchema.omit({ courseId: true }).extend({
  courseResponse: CourseSchema,
})
const RegistrationEnvelope = z.object({
  registrationCourseResponses: z.array(ServerEnrollmentSchema),
})

const ProfileSchema = z.object({
  department: z.string(),
  studentId: z.string(),
  name: z.string(),
  grade: z.string(),
  academicStatus: z.string(),
  gpa: z.number(),
  creditLimit: z.number(),
})

const CodeOptionSchema = z.object({ code: z.string(), name: z.string() })
const DepartmentEnvelope = z.object({ departmentResponses: z.array(CodeOptionSchema) })
const InterdisciplinaryEnvelope = z.object({
  interdisciplinaryMajorResponses: z.array(CodeOptionSchema),
})

// REG-003 매핑은 서버 검사 순서 변경 전까지의 안전망 → .claude/spec/convention/01_data.md §5
const SERVER_ERROR_CODES: Readonly<Record<string, SukangErrorCode>> = {
  'CRS-005': 'DUP_TIME',
  'REG-006': 'DUP_SUBJECT',
  'REG-003': 'DUP_SUBJECT',
  'REG-002': 'CREDIT_EXCEEDED',
  'REG-001': 'CLASS_FULL',
  'CRS-004': 'CLASS_FULL',
  'CRS-006': 'COURSE_TYPE_LIMIT',
  'REG-004': 'NOT_REGISTERED',
  'REG-005': 'CANCEL_FAILED',
  'AUTH-001': 'SESSION_EXPIRED',
  'AUTH-002': 'SESSION_EXPIRED',
  'AUTH-003': 'SESSION_EXPIRED',
  'AUTH-004': 'SESSION_EXPIRED',
  'AUTH-005': 'SESSION_EXPIRED',
}

const ServerErrorBodySchema = z.object({ code: z.string(), message: z.string().optional() })

const TIMEOUT_CODES = ['ECONNABORTED', 'ETIMEDOUT']

function toSukangError(error: unknown): SukangError {
  if (error instanceof SukangError) return error
  if (!axios.isAxiosError(error))
    return new SukangError('SERVER', '요청을 처리하지 못했습니다', { cause: error })

  if (error.code !== undefined && TIMEOUT_CODES.includes(error.code))
    return new SukangError('TIMEOUT', error.message, { cause: error })

  const body = ServerErrorBodySchema.safeParse(error.response?.data)
  if (body.success) {
    const mapped = SERVER_ERROR_CODES[body.data.code]
    const detail = `${body.data.code}${body.data.message === undefined ? '' : `: ${body.data.message}`}`
    return new SukangError(mapped ?? 'SERVER', detail, { cause: error })
  }
  if (error.response?.status === 401)
    return new SukangError('SESSION_EXPIRED', error.message, { cause: error })
  return new SukangError('SERVER', error.message, { cause: error })
}

async function request<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch (error) {
    throw toSukangError(error)
  }
}

function parse<S extends z.ZodType>(schema: S, data: unknown, url: string): z.infer<S> {
  const result = schema.safeParse(data)
  if (!result.success)
    throw new SukangError('SCHEMA', `응답이 계약과 다릅니다 (${url})`, { cause: result.error })
  return result.data
}

async function get<S extends z.ZodType>(
  url: string,
  schema: S,
  params?: Record<string, string>,
): Promise<z.infer<S>> {
  const response = await getApiClient().get<unknown>(url, params && { params })
  return parse(schema, response.data, url)
}

const getCourses = async (url: string, params?: Record<string, string>) =>
  (await get(url, CourseListEnvelope, params)).courseResponses

function memoizeAsync<T>(load: () => Promise<T>): () => Promise<T> {
  let inFlight: Promise<T> | null = null
  return () => {
    inFlight ??= load().catch((error: unknown) => {
      inFlight = null
      throw error
    })
    return inFlight
  }
}

const loadDepartmentCodes = memoizeAsync(async () => {
  const { departmentResponses } = await get('/courses/departments', DepartmentEnvelope)
  return new Map(departmentResponses.map((option) => [option.name, option.code]))
})

const loadInterdisciplinaryCodes = memoizeAsync(async () => {
  const { interdisciplinaryMajorResponses } = await get(
    '/courses/interdisciplinary-majors',
    InterdisciplinaryEnvelope,
  )
  return new Map(interdisciplinaryMajorResponses.map((option) => [option.name, option.code]))
})

export const httpApi: SukangApi = {
  getStudent: () =>
    request(async (): Promise<Student> => {
      const profile = await get('/members/profile', ProfileSchema)
      return {
        id: profile.studentId,
        name: profile.name,
        department: profile.department,
        grade: profile.grade.replace(/학년$/, ''),
        status: profile.academicStatus,
        gpa: profile.gpa,
        creditLimit: profile.creditLimit,
      }
    }),

  listBasket: () => request(() => getCourses('/carts')),

  listJungong: () => request(() => getCourses('/courses/major')),

  listGyoyang: ({ cptnGbn, fldGnb }) =>
    request(() =>
      getCourses('/courses/general-education', {
        'classification-code': cptnGbn,
        ...(fldGnb === undefined ? {} : { 'area-code': fldGnb }),
      }),
    ),

  listTagwa: ({ tagwaCd }) =>
    request(async () => {
      const code = (await loadDepartmentCodes()).get(tagwaCd)
      if (code === undefined) return []
      return getCourses('/courses/other-department', { department: code })
    }),

  listYungae: ({ yungaeCd }) =>
    request(async () => {
      const code = (await loadInterdisciplinaryCodes()).get(yungaeCd)
      if (code === undefined) return []
      return getCourses('/courses/interdisciplinary-major', { department: code })
    }),

  listHuss: () => request(() => getCourses('/courses/huss')),

  searchCourses: ({ q }) => request(() => getCourses('/courses/search', { keyword: q })),

  listEnrollments: () =>
    request(async (): Promise<EnrollmentRow[]> => {
      const { registrationCourseResponses } = await get('/registration', RegistrationEnvelope)
      return registrationCourseResponses.map(({ courseResponse, ...enrollment }) => ({
        ...enrollment,
        courseId: courseResponse.id,
        course: courseResponse,
      }))
    }),

  enroll: ({ courseId }) =>
    request(async () => {
      const response = await getApiClient().post<unknown>(
        `/registration/${encodeURIComponent(courseId)}`,
      )
      const { courseResponse } = parse(EnrollEnvelope, response.data, '/registration')
      return { course: courseResponse }
    }),

  cancel: ({ courseId }) =>
    request(async () => {
      await getApiClient().delete(`/registration/${encodeURIComponent(courseId)}`)
    }),
}
