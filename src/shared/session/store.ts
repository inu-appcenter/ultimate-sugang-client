import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface SessionState {
  studentId: string | null
  accessToken: string | null
  captchaFails: number
  login: (studentId: string, accessToken?: string | null) => void
  logout: () => void
  setAccessToken: (accessToken: string) => void
  recordCaptchaFail: () => number
}

export const SESSION_STORAGE_KEY = 'inu-sugang-mock.session'

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      studentId: null,
      accessToken: null,
      captchaFails: 0,
      login: (studentId, accessToken = null) => set({ studentId, accessToken, captchaFails: 0 }),
      logout: () => set({ studentId: null, accessToken: null, captchaFails: 0 }),
      setAccessToken: (accessToken) => set({ accessToken }),
      recordCaptchaFail: () => {
        const next = get().captchaFails + 1
        set({ captchaFails: next })
        return next
      },
    }),
    { name: SESSION_STORAGE_KEY, storage: createJSONStorage(() => sessionStorage) },
  ),
)
