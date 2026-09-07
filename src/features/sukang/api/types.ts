import type { Course, EnrollmentRow, Student } from '@/features/sukang/schemas'

export const CATALOG_ERROR_CODES = [
  'DUP_TIME',
  'DUP_SUBJECT',
  'CREDIT_EXCEEDED',
  'CLASS_FULL',
  'SESSION_EXPIRED',
  'TIMEOUT',
  'COURSE_TYPE_LIMIT',
  'NOT_REGISTERED',
  'CANCEL_FAILED',
] as const
export type CatalogErrorCode = (typeof CATALOG_ERROR_CODES)[number]

export type InternalErrorCode = 'SCHEMA' | 'NOT_CONFIGURED' | 'SERVER'

export type SukangErrorCode = CatalogErrorCode | InternalErrorCode

export class SukangError extends Error {
  readonly code: SukangErrorCode

  constructor(code: SukangErrorCode, message?: string, options?: { cause?: unknown }) {
    super(message ?? code, options)
    this.name = 'SukangError'
    this.code = code
  }
}

export const isSukangError = (e: unknown): e is SukangError => e instanceof SukangError

export interface SukangApi {
  getStudent(studentId: string): Promise<Student>
  listBasket(studentId: string): Promise<Course[]>
  listJungong(studentId: string): Promise<Course[]>
  listGyoyang(p: { cptnGbn: string; fldGnb?: string }): Promise<Course[]>
  listTagwa(p: { tagwaCd: string }): Promise<Course[]>
  listYungae(p: { yungaeCd: string }): Promise<Course[]>
  listHuss(): Promise<Course[]>
  searchCourses(p: { q: string }): Promise<Course[]>
  listEnrollments(studentId: string): Promise<EnrollmentRow[]>
  enroll(p: { studentId: string; courseId: string }): Promise<{ course: Course }>
  cancel(p: { studentId: string; courseId: string }): Promise<void>
}
