import { useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'

/**
 * Cursor-tracked glow. Wrap cards, photos, or a whole hero block and the
 * surface picks up a soft light that follows the pointer.
 *
 * `layer="behind"` paints the glow underneath the content (great for section
 * backgrounds), while `layer="above"` lays it over media like project shots.
 */
function Spotlight({
  children,
  className = '',
  color = '99 102 241',
  size = 340,
  opacity = 0.18,
  layer = 'above',
  ...props
}) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const rawX = useMotionValue(-9999)
  const rawY = useMotionValue(-9999)
  const x = useSpring(rawX, { stiffness: 240, damping: 30, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 240, damping: 30, mass: 0.4 })
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, rgb(${color} / ${opacity}), transparent 72%)`

  function handleMove(event) {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set(event.clientX - rect.left)
    rawY.set(event.clientY - rect.top)
  }

  function handleLeave() {
    rawX.set(-9999)
    rawY.set(-9999)
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative ${layer === 'behind' ? 'isolate' : ''} ${className}`}
      {...props}
    >
      {children}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          style={{ background }}
          className={`pointer-events-none absolute inset-0 rounded-[inherit] ${
            layer === 'behind' ? '-z-10' : 'z-20'
          }`}
        />
      )}
    </div>
  )
}

export default Spotlight
