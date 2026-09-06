import { differenceInMilliseconds, isValid } from 'date-fns'

/**
 * D16: 서버 시간 동기화 — 응답 `Date` 헤더 기준 오프셋만 계산한다(표시 UI 없음, Q-13).
 * http 어댑터(03 §3-4)가 응답마다 setOffsetFromDateHeader 를 호출한다.
 */
let offsetMs = 0

export function setOffsetFromDateHeader(
  dateHeader: string | null | undefined,
  receivedAt: Date = new Date(),
): void {
  if (!dateHeader) return
  const serverDate = new Date(dateHeader)
  if (!isValid(serverDate)) return
  offsetMs = differenceInMilliseconds(serverDate, receivedAt)
}

export const getServerOffsetMs = (): number => offsetMs

export const getServerNow = (): Date => new Date(Date.now() + offsetMs)
