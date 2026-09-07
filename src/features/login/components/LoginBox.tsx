import { zodResolver } from '@hookform/resolvers/zod'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authenticate } from '@/features/login/api'
import { LOGIN_TEXT, type LoginShortcut } from '@/features/login/constants'
import { LoginFormSchema, type LoginForm } from '@/features/login/schemas'
import { ROUTES } from '@/shared/constants/routes'
import { dialog } from '@/shared/lib/dialog'
import { handleActivateKey, handleEnterKey } from '@/shared/lib/keyboard'
import { useSessionStore } from '@/shared/session/store'

function ShortcutList({
  className,
  shortcuts,
}: {
  className?: string
  shortcuts: readonly LoginShortcut[]
}) {
  return (
    <ul className={className}>
      {shortcuts.map((shortcut) => (
        <li key={shortcut.lines[0]}>
          <a className={shortcut.className}>
            {shortcut.lines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </a>
        </li>
      ))}
    </ul>
  )
}

// <form> 을 쓰지 않는다(원 CSS 직계 선택자) → .claude/spec/convention/03_login_captcha.md §1.3
export function LoginBox() {
  const navigate = useNavigate()
  const login = useSessionStore((s) => s.login)
  const [pending, setPending] = useState(false)
  const { register, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { studentId: '', password: '' },
  })

  const submitLogin = handleSubmit(async ({ studentId, password }) => {
    if (pending) return
    setPending(true)
    try {
      const { accessToken } = await authenticate(studentId, password)
      login(studentId, accessToken)
      navigate(ROUTES.sukang)
    } catch {
      dialog.alert(LOGIN_TEXT.failed)
    } finally {
      setPending(false)
    }
  })
  const requestLogin = () => void submitLogin()

  return (
    <div id="login">
      <div className="tit">
        <h1>
          <span className="logo_ko">{LOGIN_TEXT.logoKo}</span>
          <span className="logo_sub">{LOGIN_TEXT.logoSub}</span>
          <br />
          {LOGIN_TEXT.logoEn}
        </h1>
      </div>
      <div className="login_con">
        <h3>
          <span className="logo_en">{LOGIN_TEXT.heading}</span>
        </h3>
        <div className="login_area">
          <div className="id_w">
            <p>
              <label htmlFor="login-studentId">{LOGIN_TEXT.idLabel}</label>
              <span>
                <input
                  type="text"
                  id="login-studentId"
                  autoComplete="off"
                  {...register('studentId')}
                  onKeyDown={handleEnterKey(requestLogin)}
                />
              </span>
            </p>
            <p>
              <label htmlFor="login-password">{LOGIN_TEXT.pwLabel}</label>
              <span>
                <input
                  type="password"
                  id="login-password"
                  autoComplete="off"
                  {...register('password')}
                  onKeyDown={handleEnterKey(requestLogin)}
                />
              </span>
            </p>
            <p className="txt">{LOGIN_TEXT.hint}</p>
            <p className="txt">
              <a>{LOGIN_TEXT.findLinks[0]}</a> / <a>{LOGIN_TEXT.findLinks[1]}</a>
            </p>
            <a
              className="btn_login"
              role="button"
              tabIndex={0}
              onClick={requestLogin}
              onKeyDown={handleActivateKey(requestLogin)}
            >
              {LOGIN_TEXT.button.line1}
              <br />
              {LOGIN_TEXT.button.line2}
            </a>
          </div>
          <div>
            <ShortcutList shortcuts={LOGIN_TEXT.shortcuts} />
            <ShortcutList className="last" shortcuts={LOGIN_TEXT.shortcutsLast} />
          </div>
        </div>
      </div>
      <div className="login_txt">
        {LOGIN_TEXT.notices.map((notice) => {
          const body = <span className={notice.em}>{notice.text}</span>
          return <p key={notice.text}>{notice.link ? <a>{body}</a> : body}</p>
        })}
      </div>
    </div>
  )
}
