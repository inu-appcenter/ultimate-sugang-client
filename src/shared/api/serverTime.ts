import { differenceInMilliseconds, isValid } from 'date-fns'

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
