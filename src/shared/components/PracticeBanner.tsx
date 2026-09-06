import { PRACTICE_BANNER_TEXT } from '@/shared/constants/appText'

/** D11: 연습용 배너 1줄 — `.noti em` 스타일(`.practice-banner`), 상시 노출(01 §1 필수 3). */
export function PracticeBanner() {
  return (
    <p className="practice-banner" role="note">
      {PRACTICE_BANNER_TEXT}
    </p>
  )
}
