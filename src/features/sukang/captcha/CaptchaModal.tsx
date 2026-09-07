import { useEffect, useRef, useState } from 'react'
import {
  CAPTCHA_CANVAS,
  CAPTCHA_LENGTH,
  drawCaptcha,
} from '@/features/sukang/captcha/generateCaptcha'
import { CAPTCHA_TEXT, captchaBodyLines } from '@/features/sukang/captcha/texts'
import { handleEnterKey } from '@/shared/lib/keyboard'

const NO_SCROLL_CLASS = 'jconfirm-no-scroll-374'
const INPUT_SIZE = 20

interface CaptchaModalProps {
  answer: string
  remain: number
  showError: boolean
  onConfirm: (input: string) => void
  onClose: () => void
}

export function CaptchaModal({ answer, remain, showError, onConfirm, onClose }: CaptchaModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (canvasRef.current) drawCaptcha(canvasRef.current, answer)
    inputRef.current?.focus()
  }, [answer])

  useEffect(() => {
    document.body.classList.add(NO_SCROLL_CLASS)
    return () => document.body.classList.remove(NO_SCROLL_CLASS)
  }, [])

  const handleConfirm = () => onConfirm(value.trim())

  return (
    <div className="jconfirm jconfirm-light jconfirm-open">
      <div className="jconfirm-bg" />
      <div className="jconfirm-scrollpane">
        <div className="jconfirm-row">
          <div className="jconfirm-cell">
            <div className="jconfirm-holder">
              <div className="jconfirm-box-container jconfirm-no-transition">
                <div
                  className="jconfirm-box jconfirm-hilight-shake"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="captcha-title"
                >
                  <div className="jconfirm-title-c">
                    <span className="jconfirm-icon-c" />
                    <span className="jconfirm-title" id="captcha-title">
                      {CAPTCHA_TEXT.title}
                    </span>
                  </div>
                  <div className="jconfirm-content-pane">
                    <div className="jconfirm-content">
                      <div className="capt_box">
                        <table className="capt_tbl">
                          <tbody>
                            <tr>
                              <td className="capt_img_c">
                                <canvas
                                  ref={canvasRef}
                                  width={CAPTCHA_CANVAS.width}
                                  height={CAPTCHA_CANVAS.height}
                                  aria-label="CAPTCHA 이미지"
                                />
                              </td>
                              <td className="capt_txt_c">
                                {captchaBodyLines(remain).map((line, lineIndex) => (
                                  <p key={lineIndex}>
                                    {line.map((seg, segIndex) => (
                                      <span key={segIndex} className={seg.em}>
                                        {seg.text}
                                      </span>
                                    ))}
                                  </p>
                                ))}
                                <p className="capt_field">
                                  <label htmlFor="captcha-input">{CAPTCHA_TEXT.inputLabel}</label>{' '}
                                  <input
                                    ref={inputRef}
                                    id="captcha-input"
                                    type="text"
                                    inputMode="numeric"
                                    size={INPUT_SIZE}
                                    maxLength={CAPTCHA_LENGTH}
                                    autoComplete="off"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    onKeyDown={handleEnterKey(handleConfirm)}
                                  />{' '}
                                  <button type="button" className="btn_mrc" onClick={handleConfirm}>
                                    {CAPTCHA_TEXT.confirm}
                                  </button>
                                </p>
                                {showError && <p className="capt_err">{CAPTCHA_TEXT.error}</p>}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="jconfirm-buttons">
                    <button type="button" className="btn-blue" onClick={onClose}>
                      {CAPTCHA_TEXT.close}
                    </button>
                  </div>
                  <div className="jconfirm-clear clearfix" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
