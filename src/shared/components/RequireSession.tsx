import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { useSessionStore } from '@/shared/session/store'

/** 03 §5-1 / D14: 학번 세션이 없으면 `/` 로 리다이렉트(replace). 인증 아님 — 표시용 식별자 유무만 본다. */
export function RequireSession({ children }: { children: ReactNode }) {
  const studentId = useSessionStore((s) => s.studentId)
  if (!studentId) return <Navigate to={ROUTES.login} replace />
  return <>{children}</>
}
