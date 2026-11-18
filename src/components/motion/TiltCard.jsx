import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

const springConfig = { stiffness: 180, damping: 20, mass: 0.6 }

/**
 * Subtle 3D tilt that follows the pointer. Values are spring-smoothed so the
 * card never snaps, and the effect is disabled for reduced-motion users.
 */
function TiltCard({ children, max = 6, className = '', ...props }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const rotateX = useSpring(useMotionValue(0), springConfig)
  const rotateY = useSpring(useMotionValue(0), springConfig)
  const scale = useSpring(useMotionValue(1), springConfig)

  function handlePointerMove(event) {
    if (reduceMotion) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5

    rotateY.set(px * max * 2)
    rotateX.set(-py * max * 2)
  }

  function reset() {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => !reduceMotion && scale.set(1.015)}
      onPointerLeave={reset}
      style={{
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        scale: reduceMotion ? 1 : scale,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default TiltCard
