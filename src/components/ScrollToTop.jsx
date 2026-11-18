import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { resetScrollDirection } from '../hooks/useScrollDirection'

/**
 * Resets scroll on route changes and scrolls to the matching element when a
 * hash is present (for example /about#skills).
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 })
      resetScrollDirection('down')
      return undefined
    }

    const id = decodeURIComponent(hash.slice(1))
    let secondFrame = 0

    // Two frames give the target route enough time to render its sections.
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        const target = document.getElementById(id)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, left: 0 })
        }
        resetScrollDirection('down')
      })
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [pathname, hash])

  return null
}

export default ScrollToTop
