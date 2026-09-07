import { z } from 'zod'
import { COURSE_TAGS, COURSE_TYPES } from '@/features/sukang/constants/codes'
import { CUSTOM_QUERY_MAX_LEN, CUSTOM_QUERY_MIN_LEN } from '@/shared/constants/fieldLimits'

export const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  department: z.string(),
  grade: z.union([z.string(), z.number()]),
  status: z.string(),
  gpa: z.number(),
  creditLimit: z.number(),
})
export type Student = z.infer<typeof StudentSchema>

export const CourseSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  nameEn: z.string(),
  professor: z.string(),
  credits: z.number(),
  capacity: z.number(),
  enrolled: z.number(),
  courseType: z.enum(COURSE_TYPES),
  courseArea: z.string(),
  department: z.string(),
  grade: z.string(),
  schedule: z.string(),
  tags: z.array(z.enum(COURSE_TAGS)),
  isEnglish: z.boolean(),
  isNight: z.boolean(),
  isClosed: z.boolean(),
})
export type Course = z.infer<typeof CourseSchema>
export const CourseListSchema = z.array(CourseSchema)

export const EnrollmentSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  resolvedType: z.enum(COURSE_TYPES),
  reAttendance: z.string(),
  createdAt: z.string(),
})
export type Enrollment = z.infer<typeof EnrollmentSchema>

export const EnrollmentRowSchema = EnrollmentSchema.extend({ course: CourseSchema })
export type EnrollmentRow = z.infer<typeof EnrollmentRowSchema>
export const EnrollmentRowListSchema = z.array(EnrollmentRowSchema)

export const EnrollResultSchema = z.object({ course: CourseSchema })
export type EnrollResult = z.infer<typeof EnrollResultSchema>

export const CustomSearchFormSchema = z.object({
  q: z.string().trim().min(CUSTOM_QUERY_MIN_LEN).max(CUSTOM_QUERY_MAX_LEN),
})
export type CustomSearchForm = z.infer<typeof CustomSearchFormSchema>
