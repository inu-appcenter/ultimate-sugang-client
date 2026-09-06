import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { SukangPage } from '@/pages/SukangPage'
import { RequireSession } from '@/shared/components/RequireSession'
import { ROUTES } from '@/shared/constants/routes'

/** D7: 단일 SPA, 라우트 `/`(LOGIN) · `/sukang?menu={Key}`. `/sukang` 은 세션 필요(03 §5-1). */
export const router = createBrowserRouter([
  { path: ROUTES.login, element: <LoginPage /> },
  {
    path: ROUTES.sukang,
    element: (
      <RequireSession>
        <SukangPage />
      </RequireSession>
    ),
  },
])
