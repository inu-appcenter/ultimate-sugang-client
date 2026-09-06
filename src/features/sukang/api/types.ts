import type { Course, EnrollmentRow, Student } from '@/features/sukang/schemas'

/** 02 §4-3 에러 종별(메시지 카탈로그 키) — 값 추가/변경 금지 */
export const CATALOG_ERROR_CODES = [
  'DUP_TIME',
  'DUP_SUBJECT',
  'CREDIT_EXCEEDED',
  'CLASS_FULL',
  'SESSION_EXPIRED',
  'NOT_IN_PERIOD',
  'TIMEOUT',
] as const
export type CatalogErrorCode = (typeof CATALOG_ERROR_CODES)[number]

/** 하네스 내부 코드(03 §3-1·§3-4): 응답 스키마 불일치 · http 어댑터 미구성. 메시지는 UNKNOWN fallback(D6). */
export type InternalErrorCode = 'SCHEMA' | 'NOT_CONFIGURED'

export type SukangErrorCode = CatalogErrorCode | InternalErrorCode

/** 어댑터 오류 정규화 형태(03 §3-1) */
export class SukangError extends Error {
  readonly code: SukangErrorCode

  constructor(code: SukangErrorCode, message?: string, options?: { cause?: unknown }) {
    super(message ?? code, options)
    this.name = 'SukangError'
    this.code = code
  }
}

export const isSukangError = (e: unknown): e is SukangError => e instanceof SukangError

/** 03 §3-2 어댑터 인터페이스 — 02 §3 O-1~O-11 과 1:1. O-12~14 는 Q-5/Q-6 답변 전 추가하지 않는다. */
export interface SukangApi {
  /** O-1 현재 학생 정보 */
  getStudent(studentId: string): Promise<Student>
  /** O-2 장바구니 목록 */
  listBasket(studentId: string): Promise<Course[]>
  /** O-3 전공과목 목록(소속 기준) */
  listJungong(studentId: string): Promise<Course[]>
  /** O-4 교양과목 목록 — 이수구분 코드(cmbCptnGbn) + 이수영역 코드(cmbFldGnb*, 선택) */
  listGyoyang(p: { cptnGbn: string; fldGnb?: string }): Promise<Course[]>
  /** O-5 타학과과목 목록 — 학과(부) 코드(cmbTagwaCd) */
  listTagwa(p: { tagwaCd: string }): Promise<Course[]>
  /** O-6 연계전공과목 목록 — 연계전공 코드(cmbYungaeCd) */
  listYungae(p: { yungaeCd: string }): Promise<Course[]>
  /** O-7 HUSS전공과목 목록 */
  listHuss(): Promise<Course[]>
  /** O-8 과목명(코드) 조회 — 2자 이상(과목명 또는 학수번호, 판단은 서버) */
  searchCourses(p: { q: string }): Promise<Course[]>
  /** O-9 신청내역 목록(+Course 조인) */
  listEnrollments(studentId: string): Promise<EnrollmentRow[]>
  /** O-10 수강 신청 — 성공 시 교과목(성공 메시지에 교과목명 필요) 또는 SukangError */
  enroll(p: { studentId: string; courseId: string }): Promise<{ course: Course }>
  /** O-11 수강 취소 */
  cancel(p: { studentId: string; courseId: string }): Promise<void>
}
