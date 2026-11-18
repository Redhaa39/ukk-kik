import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

const springConfig = { stiffness: 220, damping: 18, mass: 0.45 }

/**
 * Magnetic hover: the child is pulled gently toward the pointer and springs
 * back on leave. Keep `strength` low (0.15–0.35) for a premium feel.
 */
function Magnetic({ children, strength = 0.25, className = '', ...props }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const x = useSpring(useMotionValue(0), springConfig)
  const y = useSpring(useMotionValue(0), springConfig)

  function handleMove(event) {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * strength)
    y.set((event.clientY - rect.top - rect.height / 2) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: reduceMotion ? 0 : x, y: reduceMotion ? 0 : y }}
      className={`inline-flex ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Magnetic
