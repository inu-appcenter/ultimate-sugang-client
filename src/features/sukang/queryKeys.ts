import type { ScreenKey } from '@/features/sukang/constants/screens'

export const sukangKeys = {
  all: ['sukang'] as const,
  student: (studentId: string) => ['sukang', 'student', studentId] as const,
  courses: (screen: ScreenKey, params: unknown) => ['sukang', 'courses', screen, params] as const,
  enrollments: (studentId: string) => ['sukang', 'enrollments', studentId] as const,
}
