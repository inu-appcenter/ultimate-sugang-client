import { handleActivateKey } from '@/shared/lib/keyboard'

export type ActionKind = 'enroll' | 'closed' | 'cancel'

const LABEL: Record<ActionKind, string> = { enroll: '신청', closed: '마감', cancel: '취소' }
const CLASS_NAME: Record<ActionKind, string> = {
  enroll: 'btn_blue',
  closed: 'btn_grey2',
  cancel: 'btn_red',
}

interface ActionButtonProps {
  kind: ActionKind
  onClick?: () => void
}

export function ActionButton({ kind, onClick }: ActionButtonProps) {
  // 마감은 핸들러·커서 없음(정원 사전 차단) → .claude/spec/convention/02_ui.md §6
  if (kind === 'closed') return <a className={CLASS_NAME.closed}>{LABEL.closed}</a>

  return (
    <a
      className={CLASS_NAME[kind]}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleActivateKey(() => onClick?.())}
    >
      {LABEL[kind]}
    </a>
  )
}
