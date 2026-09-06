import type { ScreenKey } from '@/features/sukang/constants/screens'

/** 도메인 queryKey 팩토리(rules/good-patterns.md). 신청 성공 시 enrollments 만 invalidate — courses 는 D4 미갱신. */
export const sukangKeys = {
  all: ['sukang'] as const,
  student: (studentId: string) => ['sukang', 'student', studentId] as const,
  courses: (screen: ScreenKey, params: unknown) => ['sukang', 'courses', screen, params] as const,
  enrollments: (studentId: string) => ['sukang', 'enrollments', studentId] as const,
}
