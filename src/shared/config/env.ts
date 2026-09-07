import { z } from 'zod'

const emptyToUndefined = (v: unknown): unknown =>
  typeof v === 'string' && v.trim() === '' ? undefined : v

const EnvSchema = z
  .object({
    VITE_API_ADAPTER: z.preprocess(emptyToUndefined, z.enum(['mock', 'http']).default('mock')),
    VITE_API_BASE_URL: z.preprocess(emptyToUndefined, z.string().optional()),
    VITE_MOCK_FAIL: z.preprocess(emptyToUndefined, z.enum(['session']).optional()),
    VITE_CAPTCHA: z.preprocess(emptyToUndefined, z.enum(['on', 'off']).default('off')),
  })
  .refine((e) => e.VITE_API_ADAPTER !== 'http' || Boolean(e.VITE_API_BASE_URL), {
    message: 'VITE_API_ADAPTER=http 이면 VITE_API_BASE_URL 이 필수입니다 (03 §8)',
    path: ['VITE_API_BASE_URL'],
  })

export type Env = z.infer<typeof EnvSchema>

export const env: Env = EnvSchema.parse(import.meta.env)
