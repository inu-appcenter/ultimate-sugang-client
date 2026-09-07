import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { useSessionStore } from '@/shared/session/store'

export function RequireSession({ children }: { children: ReactNode }) {
  const studentId = useSessionStore((s) => s.studentId)
  if (!studentId) return <Navigate to={ROUTES.login} replace />
  return <>{children}</>
}
