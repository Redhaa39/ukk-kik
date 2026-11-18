import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '../../lib/motion'

/**
 * Masked line reveal: the text slides up from behind an invisible clip edge.
 * Used for hero headings, where a fade alone feels too flat.
 */
function LineReveal({ children, delay = 0, duration = 0.9, className = '' }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <span className={`block ${className}`}>{children}</span>
  }

  return (
    <span className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration, ease: EASE.out, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default LineReveal
