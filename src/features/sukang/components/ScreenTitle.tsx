import type { ReactNode } from 'react'
import { SearchSpacer } from '@/features/sukang/components/SearchSpacer'
import { SEARCH_BUTTON_LABEL } from '@/features/sukang/constants/screens'

interface ScreenTitleProps {
  title: string
  search?: ReactNode
  onSearch?: () => void
  searching?: boolean
}

// tit_scr 는 제목 td 에만 · 조회 버튼은 .btn_search → .claude/spec/convention/02_ui.md §4
export function ScreenTitle({ title, search, onSearch, searching = false }: ScreenTitleProps) {
  return (
    <div className="sjt_sch">
      <table>
        <tbody>
          <tr>
            <td className="tit_scr">{title}</td>
            {search !== undefined && (
              <>
                <SearchSpacer />
                <td>→</td>
                <SearchSpacer />
                {search}
                <SearchSpacer />
                <td>
                  <button
                    type="button"
                    className="btn_search"
                    onClick={onSearch}
                    disabled={searching}
                  >
                    {SEARCH_BUTTON_LABEL}
                  </button>
                </td>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
