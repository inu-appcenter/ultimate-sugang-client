import { z } from 'zod'

/**
 * 03 §8 env 구조. 실제 값은 .env(사람 입력, 커밋 금지) — 여기서는 파싱·기본값·필수 검증만.
 * 빈 문자열은 미설정으로 취급한다(.env.example 의 `KEY=` 형태).
 */
const emptyToUndefined = (v: unknown): unknown =>
  typeof v === 'string' && v.trim() === '' ? undefined : v

const EnvSchema = z
  .object({
    /** mock(기본, D1) | http(계약 Q-1 도착 후) */
    VITE_API_ADAPTER: z.preprocess(emptyToUndefined, z.enum(['mock', 'http']).default('mock')),
    /** http 어댑터 선택 시에만 필수 */
    VITE_API_BASE_URL: z.preprocess(emptyToUndefined, z.string().optional()),
    /** session → mock 이 SESSION_EXPIRED 를 강제 발생(수동 검증용, 03 §3-3) */
    VITE_MOCK_FAIL: z.preprocess(emptyToUndefined, z.enum(['session']).optional()),
  })
  .refine((e) => e.VITE_API_ADAPTER !== 'http' || Boolean(e.VITE_API_BASE_URL), {
    message: 'VITE_API_ADAPTER=http 이면 VITE_API_BASE_URL 이 필수입니다 (03 §8)',
    path: ['VITE_API_BASE_URL'],
  })

export type Env = z.infer<typeof EnvSchema>

export const env: Env = EnvSchema.parse(import.meta.env)
