import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/**
 * D14: 세션 = 표시용 학번 1개. 인증·토큰·쿠키·재발급 없음(02 §1).
 * sessionStorage persist — 탭을 닫으면 소멸한다(03 §5-1).
 */
export interface SessionState {
  studentId: string | null
  login: (studentId: string) => void
  logout: () => void
}

export const SESSION_STORAGE_KEY = 'inu-sugang-mock.session'

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      studentId: null,
      login: (studentId) => set({ studentId }),
      logout: () => set({ studentId: null }),
    }),
    { name: SESSION_STORAGE_KEY, storage: createJSONStorage(() => sessionStorage) },
  ),
)
