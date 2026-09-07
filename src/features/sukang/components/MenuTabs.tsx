import {
  SCREEN_KEYS,
  SCREENS,
  TAB_CAUTION,
  type ScreenKey,
} from '@/features/sukang/constants/screens'
import { handleActivateKey } from '@/shared/lib/keyboard'

// .btn_area 는 flex 금지(블록 + 인라인 흐름) → .claude/spec/convention/02_ui.md §3
export function MenuTabs({ onSelect }: { onSelect: (key: ScreenKey) => void }) {
  return (
    <div className="btn_area">
      {SCREEN_KEYS.map((key) => (
        <a
          key={key}
          className="btn_re"
          role="button"
          tabIndex={0}
          onClick={() => onSelect(key)}
          onKeyDown={handleActivateKey(() => onSelect(key))}
        >
          {SCREENS[key].tabKo}
          <br />
          <span className="tab-en">{SCREENS[key].tabEn}</span>
        </a>
      ))}
      <p className="noti">
        {TAB_CAUTION.head}
        <em>{TAB_CAUTION.night}</em>
        {TAB_CAUTION.sep}
        <span>{TAB_CAUTION.closed}</span>
      </p>
    </div>
  )
}
