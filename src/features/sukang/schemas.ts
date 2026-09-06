import { z } from 'zod'
import { COURSE_TAGS } from '@/features/sukang/constants/codes'

/** 02 §2-3 Student. grade 는 string/number(명세 표기) · status enum 미기재(Q-14) → 문자열. */
export const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  department: z.string(),
  grade: z.union([z.string(), z.number()]),
  status: z.string(),
  creditLimit: z.number(),
})
export type Student = z.infer<typeof StudentSchema>

/**
 * 02 §2-1 Course(원§12 최소 스키마). capacity/enrolled 는 화면 비노출(D4).
 * 원어여부(EN) 컬럼 대응 필드 없음(Q-14) → 스키마에 추가하지 않는다(빈 셀 렌더).
 * 온라인 강좌의 schedule 은 빈 배열로 취급(Q-14 미확정 — join 결과 빈 문자열은 동일).
 */
export const CourseSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  nameEn: z.string(),
  professor: z.string(),
  credits: z.number(),
  capacity: z.number(),
  enrolled: z.number(),
  /** 이수구분 — 개설학과 기준(조회 화면용, 01 §3-2). enum 제약 없음(Q-14) */
  courseType: z.string(),
  /** 이수영역(교양) — 02 §5-1 명칭. 교양 외 빈 문자열 */
  courseArea: z.string(),
  department: z.string(),
  grade: z.string(),
  /** 시간표 문자열 배열(01 §3-4 문법) — 프론트는 공백 1칸 join 으로 그대로 표시 */
  schedule: z.array(z.string()),
  tags: z.array(z.enum(COURSE_TAGS)),
  isNight: z.boolean(),
  isClosed: z.boolean(),
})
export type Course = z.infer<typeof CourseSchema>
export const CourseListSchema = z.array(CourseSchema)

/** 02 §2-2 Enrollment. createdAt 형식 미기재(Q-14) → string(표시에 쓰지 않음). */
export const EnrollmentSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  /** 학생 기준 재계산된 이수구분 — 서버 산출, 프론트 재계산 금지(02 §4-2) */
  resolvedType: z.string(),
  /** 재수강 구분 — 신규 신청 시 빈 값 */
  reAttendance: z.string(),
  createdAt: z.string(),
})
export type Enrollment = z.infer<typeof EnrollmentSchema>

/** 03 §3-2 EnrollmentRow = Enrollment & { course } — 신청내역 11컬럼 렌더용 조인(mock 내장, 실 계약은 Q-1) */
export const EnrollmentRowSchema = EnrollmentSchema.extend({ course: CourseSchema })
export type EnrollmentRow = z.infer<typeof EnrollmentRowSchema>
export const EnrollmentRowListSchema = z.array(EnrollmentRowSchema)

/** O-10 성공 응답 */
export const EnrollResultSchema = z.object({ course: CourseSchema })
export type EnrollResult = z.infer<typeof EnrollResultSchema>
