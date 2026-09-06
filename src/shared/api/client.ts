import axios, { type AxiosInstance } from 'axios'

/** 기본 타임아웃(ms). 명세 미기재 — 하네스 기본값(http 어댑터 Q-1 도착 시 재확인). */
export const DEFAULT_TIMEOUT_MS = 10_000

/**
 * axios 인스턴스 팩토리(03 §4). 인증 헤더·토큰 재발급 큐 없음(02 §1 인증 없음).
 * http 어댑터(03 §3-4, Q-1 이후)만 사용한다 — mock 은 네트워크를 쓰지 않는다.
 */
export function createApiClient(
  baseURL: string,
  timeout: number = DEFAULT_TIMEOUT_MS,
): AxiosInstance {
  return axios.create({ baseURL, timeout })
}
