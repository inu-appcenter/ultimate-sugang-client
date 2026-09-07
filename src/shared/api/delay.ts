export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const ms = minMs + Math.random() * Math.max(0, maxMs - minMs)
  return sleep(ms)
}
