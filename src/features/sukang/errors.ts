import { isSukangError } from '@/features/sukang/api/types'
import { messageForError } from '@/features/sukang/constants/messages'
import { dialog } from '@/shared/lib/dialog'
import { useSessionStore } from '@/shared/session/store'

export function reportSukangError(err: unknown): void {
  dialog.alert(messageForError(err))
  if (isSukangError(err) && err.code === 'SESSION_EXPIRED') useSessionStore.getState().logout()
}
