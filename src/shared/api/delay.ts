export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

/** [minMs, maxMs] 균등 랜덤 지연 — mock 의 서버 지연 시뮬레이션용(원§12 200~800ms). */
export function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const ms = minMs + Math.random() * Math.max(0, maxMs - minMs)
  return sleep(ms)
}
