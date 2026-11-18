import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { EASE, revealOffset, viewportRepeat } from '../lib/motion'
import { useScrollDirection } from '../hooks/useScrollDirection'

/**
 * Scroll reveal with depth: the element rises into place from a slightly
 * rotated, blurred, scaled-down state. Direction-aware on vertical axes so
 * content enters from the side you are scrolling from.
 *
 * `delay` keeps the millisecond API the pages already use, so lists can be
 * staggered simply by passing `delay={index * 80}`.
 */
function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  duration = 0.75,
  distance = 28,
  direction = 'up',
  blur = true,
  tilt = true,
  once = false,
  amount = viewportRepeat.amount,
  margin = viewportRepeat.margin,
  children,
  ...props
}) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const scrollDirection = useScrollDirection()
  const inView = useInView(ref, { once, amount, margin })

  if (reduceMotion) {
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    )
  }

  const isVertical = direction === 'up' || direction === 'down'
  const resolvedDirection =
    !once && isVertical
      ? scrollDirection === 'up'
        ? 'down'
        : 'up'
      : direction

  const hidden = {
    opacity: 0,
    ...revealOffset(resolvedDirection, distance),
    scale: 0.975,
    rotateX: tilt && isVertical ? (resolvedDirection === 'up' ? 7 : -7) : 0,
    rotateY:
      tilt && !isVertical && resolvedDirection !== 'none'
        ? resolvedDirection === 'left'
          ? 7
          : -7
        : 0,
    filter: blur ? 'blur(10px)' : 'blur(0px)',
    transformPerspective: 1200,
    transition: { duration: 0.35, ease: EASE.soft },
  }

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    filter: 'blur(0px)',
    transformPerspective: 1200,
    transition: {
      duration,
      delay: delay / 1000,
      ease: EASE.expo,
    },
  }

  const MotionTag = motion[Tag] || motion.div

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden, visible }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal
