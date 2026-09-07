import type { UseFormRegisterReturn } from 'react-hook-form'
import { handleEnterKey } from '@/shared/lib/keyboard'

interface SearchTextProps {
  id: string
  registration: UseFormRegisterReturn
  onEnter: () => void
}

// 폭·높이는 size=30 + UA 기본에 맡긴다(고정 px 금지) → .claude/spec/convention/02_ui.md §4
export function SearchText({ id, registration, onEnter }: SearchTextProps) {
  return (
    <td>
      <span>
        <input
          type="text"
          id={id}
          size={30}
          autoComplete="off"
          {...registration}
          onKeyDown={handleEnterKey(onEnter)}
        />
      </span>
    </td>
  )
}
