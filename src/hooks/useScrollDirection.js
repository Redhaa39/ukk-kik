import { useSyncExternalStore } from 'react'

/**
 * One tiny external store shared by every reveal component.
 *
 * Reading scroll direction from a module-level store (instead of one listener
 * per component) keeps the cost flat no matter how many sections a page has.
 * Direction flips are the only thing that notifies subscribers, so React does
 * not re-render on every scroll frame.
 */

let direction = 'down'
let lastY = typeof window === 'undefined' ? 0 : window.scrollY
let listening = false
const listeners = new Set()

function handleScroll() {
  const y = window.scrollY

  // Ignore sub-pixel jitter and rubber-band overscroll.
  if (Math.abs(y - lastY) < 6) return

  const next = y > lastY ? 'down' : 'up'
  lastY = y

  if (next !== direction) {
    direction = next
    listeners.forEach((listener) => listener())
  }
}

function subscribe(listener) {
  listeners.add(listener)

  if (!listening) {
    lastY = window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true })
    listening = true
  }

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0 && listening) {
      window.removeEventListener('scroll', handleScroll)
      listening = false
    }
  }
}

/**
 * Reset the store after a programmatic jump (route change, hash link) so the
 * next page reveals downwards instead of inheriting the previous direction.
 */
export function resetScrollDirection(next = 'down') {
  direction = next
  if (typeof window !== 'undefined') lastY = window.scrollY
  listeners.forEach((listener) => listener())
}

export function useScrollDirection() {
  return useSyncExternalStore(
    subscribe,
    () => direction,
    () => 'down',
  )
}
