import { isSukangError } from '@/features/sukang/api/types'
import { messageForError } from '@/features/sukang/constants/messages'
import { dialog } from '@/shared/lib/dialog'
import { useSessionStore } from '@/shared/session/store'

/**
 * 03 §5-1·§5-2: 에러 → alert(카탈로그 문구 → UNKNOWN). 토스트 없음.
 * SESSION_EXPIRED 는 alert 후 logout → RequireSession 이 `/` 로 보낸다(D14, Q-13 기본값).
 */
export function reportSukangError(err: unknown): void {
  dialog.alert(messageForError(err))
  if (isSukangError(err) && err.code === 'SESSION_EXPIRED') useSessionStore.getState().logout()
}
