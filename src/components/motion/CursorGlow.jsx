import { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/**
 * Soft light that trails the pointer across the public site. Purely decorative:
 * it is skipped for touch devices and reduced-motion users, and it never
 * captures pointer events.
 */
function CursorGlow() {
  const reduceMotion = useReducedMotion()
  const rawX = useMotionValue(-800)
  const rawY = useMotionValue(-800)
  const x = useSpring(rawX, { stiffness: 150, damping: 24, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 150, damping: 24, mass: 0.5 })

  useEffect(() => {
    if (reduceMotion) return undefined
    if (typeof window === 'undefined') return undefined
    if (window.matchMedia('(pointer: coarse)').matches) return undefined

    function handleMove(event) {
      rawX.set(event.clientX)
      rawY.set(event.clientY)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [reduceMotion, rawX, rawY])

  if (reduceMotion) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y, marginLeft: -300, marginTop: -300 }}
      className="pointer-events-none fixed left-0 top-0 z-[55] hidden h-[600px] w-[600px] rounded-full opacity-70 mix-blend-screen lg:block"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12),rgba(168,85,247,0.05)_42%,transparent_68%)] blur-2xl" />
    </motion.div>
  )
}

export default CursorGlow
