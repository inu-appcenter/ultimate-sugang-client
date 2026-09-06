import { httpApi } from '@/features/sukang/api/httpApi'
import { mockApi } from '@/features/sukang/api/mock/mockApi'
import type { SukangApi } from '@/features/sukang/api/types'
import { env } from '@/shared/config/env'

/** 03 §3-1 어댑터 선택 — `VITE_API_ADAPTER`(기본 mock, D1) */
export function getAdapter(): SukangApi {
  return env.VITE_API_ADAPTER === 'http' ? httpApi : mockApi
}
