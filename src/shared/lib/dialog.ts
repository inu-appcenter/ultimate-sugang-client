export const dialog = {
  alert(message: string): void {
    window.alert(message)
  },
  confirm(message: string): boolean {
    return window.confirm(message)
  },
}
