import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { SukangPage } from '@/pages/SukangPage'
import { ROUTES } from '@/shared/constants/routes'

/** D7: 단일 SPA, 라우트 `/`(LOGIN) · `/sukang?menu={Key}`. RequireSession 적용은 step-2 (03 §4). */
export const router = createBrowserRouter([
  { path: ROUTES.login, element: <LoginPage /> },
  { path: ROUTES.sukang, element: <SukangPage /> },
])
