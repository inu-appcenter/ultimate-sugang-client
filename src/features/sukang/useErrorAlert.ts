import { useEffect, useRef } from 'react'
import { reportSukangError } from '@/features/sukang/errors'

export function useErrorAlert(error: unknown): void {
  const reported = useRef<unknown>(null)
  useEffect(() => {
    if (!error || reported.current === error) return
    reported.current = error
    reportSukangError(error)
  }, [error])
}
