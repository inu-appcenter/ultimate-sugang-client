import type { ReactNode } from 'react'

/** 05 §4-1 결과 스크롤 컨테이너 `div.sch_areaT`(337px, overflow-y auto). 로딩 중 aria-busy. */
export function ResultArea({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <div>
      <div className="sch_areaT" aria-busy={busy}>
        {children}
      </div>
    </div>
  )
}
