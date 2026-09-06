import type { KeyboardEvent } from 'react'

/** 05 §4-7 액션 셀 3종. `마감` 은 핸들러 없음·커서 없음(01 §6-3). */
export type ActionKind = 'enroll' | 'closed' | 'cancel'

const LABEL: Record<ActionKind, string> = { enroll: '신청', closed: '마감', cancel: '취소' }
const CLASS_NAME: Record<ActionKind, string> = {
  enroll: 'btn_blue',
  closed: 'btn_grey2',
  cancel: 'btn_red',
}

export function ActionButton({ kind, onClick }: { kind: ActionKind; onClick?: () => void }) {
  if (kind === 'closed') return <a className={CLASS_NAME.closed}>{LABEL.closed}</a>

  const onKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }
  return (
    <a
      className={CLASS_NAME[kind]}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {LABEL[kind]}
    </a>
  )
}
