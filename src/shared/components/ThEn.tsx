import type { ReactNode } from 'react'

/** 영문 라벨 — 원 `<font size="1" color=…>` 대체(D2). 스타일 `.th-en`(--font-tiny, --blue-en). */
export function ThEn({ children }: { children: ReactNode }) {
  return <span className="th-en">{children}</span>
}
