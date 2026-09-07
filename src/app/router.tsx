import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { SukangPage } from '@/pages/SukangPage'
import { RequireSession } from '@/shared/components/RequireSession'
import { ROUTES } from '@/shared/constants/routes'

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
