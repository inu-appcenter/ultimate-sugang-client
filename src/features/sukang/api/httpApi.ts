import type { SukangApi } from '@/features/sukang/api/types'
import { SukangError } from '@/features/sukang/api/types'

/**
 * http 어댑터 스텁(03 §3-4). API 계약(Q-1) 도착 전에는 구현하지 않는다 — 엔드포인트/URL/envelope 창작 금지(D1).
 * 계약 도착 시: shared/api/client.ts 인스턴스 사용, 응답 → Zod parse, `Date` 헤더 → serverTime, 타임아웃 → TIMEOUT.
 */
const notConfigured = (): never => {
  throw new SukangError(
    'NOT_CONFIGURED',
    'http 어댑터는 API 계약(Q-1) 도착 전 구현하지 않습니다 — VITE_API_ADAPTER=mock 을 사용하세요',
  )
}

export const httpApi: SukangApi = {
  getStudent: async () => notConfigured(),
  listBasket: async () => notConfigured(),
  listJungong: async () => notConfigured(),
  listGyoyang: async () => notConfigured(),
  listTagwa: async () => notConfigured(),
  listYungae: async () => notConfigured(),
  listHuss: async () => notConfigured(),
  searchCourses: async () => notConfigured(),
  listEnrollments: async () => notConfigured(),
  enroll: async () => notConfigured(),
  cancel: async () => notConfigured(),
}
