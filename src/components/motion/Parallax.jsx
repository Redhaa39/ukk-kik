import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'

/**
 * Scroll-linked drift. The element travels as it crosses the viewport, giving
 * layered sections and hero photos a sense of depth.
 */
function Parallax({
  children,
  className = '',
  distance = 32,
  rotate = 0,
  scale = 0,
  ...props
}) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const rawY = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  const rawRotate = useTransform(scrollYProgress, [0, 1], [rotate, -rotate])
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1 - scale, 1, 1 - scale])
  const y = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.5 })
  const rotation = useSpring(rawRotate, { stiffness: 120, damping: 24, mass: 0.5 })

  return (
    <motion.div
      ref={ref}
      style={
        reduceMotion
          ? undefined
          : { y, rotate: rotation, scale: scale ? rawScale : 1 }
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Parallax
