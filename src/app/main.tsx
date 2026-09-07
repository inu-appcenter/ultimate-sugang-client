import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// CSS import 순서 고정 → .claude/spec/convention/03_login_captcha.md §1.4
import 'jquery-confirm/dist/jquery-confirm.min.css'
import '@/shared/styles/globals.css'
import { App } from '@/app/App'

const container = document.getElementById('root')
if (!container) throw new Error('#root 엘리먼트가 없습니다')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
