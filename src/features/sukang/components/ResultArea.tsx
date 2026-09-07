import type { ReactNode } from 'react'

export function ResultArea({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <div>
      <div className="sch_areaT" aria-busy={busy}>
        {children}
      </div>
    </div>
  )
}
