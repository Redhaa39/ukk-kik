import { useEffect, useState } from 'react'

/**
 * Tracks which section is currently crossing the middle of the viewport.
 * Returns the id of the active section, or '' when no section is in view.
 */
export default function useActiveSection(ids, enabled = true) {
  const key = ids.join(',')
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!enabled) return undefined

    const elements = key
      .split(',')
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [key, enabled])

  return enabled ? activeId : ''
}
