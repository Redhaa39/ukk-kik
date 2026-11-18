import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  fadeUpFor,
  staggerContainer,
  viewportRepeat,
} from '../../lib/motion'
import { useScrollDirection } from '../../hooks/useScrollDirection'

/**
 * Parent that staggers the entrance of its <StaggerItem> children.
 * Re-arms when it leaves the viewport, and children follow the scroll
 * direction (from below while scrolling down, from above while scrolling up).
 */
function StaggerGroup({
  as: Tag = 'div',
  className = '',
  stagger = 0.08,
  delayChildren = 0.06,
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
  const MotionTag = motion[Tag] || motion.div

  if (reduceMotion) {
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={scrollDirection}
      variants={staggerContainer(stagger, delayChildren)}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Child of <StaggerGroup>. Inherits timing and direction from the parent.
 */
function StaggerItem({ as: Tag = 'div', className = '', children, ...props }) {
  const MotionTag = motion[Tag] || motion.div

  return (
    <MotionTag variants={fadeUpFor} className={className} {...props}>
      {children}
    </MotionTag>
  )
}

export { StaggerGroup, StaggerItem }
