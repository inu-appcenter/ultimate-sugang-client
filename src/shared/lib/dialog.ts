/**
 * 03 §5-2: 다이얼로그는 네이티브 alert/confirm 만(D2 — 토스트·커스텀 모달 금지).
 * window.* 에 위임하는 얇은 래퍼 — 테스트에서 대체하는 지점.
 */
export const dialog = {
  alert(message: string): void {
    window.alert(message)
  },
  confirm(message: string): boolean {
    return window.confirm(message)
  },
}
