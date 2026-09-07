import type { KeyboardEvent } from 'react'

const ACTIVATE_KEYS = ['Enter', ' ']

export function handleActivateKey<T extends HTMLElement>(activate: () => void) {
  return (event: KeyboardEvent<T>) => {
    if (!ACTIVATE_KEYS.includes(event.key)) return
    event.preventDefault()
    activate()
  }
}

export function handleEnterKey<T extends HTMLElement>(activate: () => void) {
  return (event: KeyboardEvent<T>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    activate()
  }
}
