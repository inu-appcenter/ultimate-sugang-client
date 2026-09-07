import { Fragment } from 'react'
import type { NoticeLine } from '@/features/sukang/constants/notices'

// 조회 전에는 결과 영역 대신 이 박스가 온다 → .claude/spec/convention/02_ui.md §5
export function GuideBox({ lines }: { lines: readonly NoticeLine[] }) {
  return (
    <div className="guide_box">
      <div className="guide_inner">
        <br />
        {lines.map((line, i) => (
          <Fragment key={line.text}>
            {line.emphasis === undefined ? (
              line.text
            ) : (
              <span className={line.emphasis === 'red' ? 'em_red' : 'em_blue'}>{line.text}</span>
            )}
            <br />
            {i === 0 && <br />}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
