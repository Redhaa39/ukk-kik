import { motion, useReducedMotion } from 'motion/react'

/**
 * Ambient hero backdrop: a faint blueprint grid, slow-drifting colour clouds,
 * and a top light bloom. Purely decorative.
 */
function Aurora({ className = '' }) {
  const reduceMotion = useReducedMotion()

  const drift = (x, y, scale, duration) =>
    reduceMotion
      ? undefined
      : {
          x,
          y,
          scale,
          transition: {
            duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          },
        }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="hero-grid absolute inset-0" />

      <motion.div
        className="absolute -left-44 -top-48 h-[34rem] w-[34rem] rounded-full bg-[#6366F1]/25 blur-[110px]"
        animate={drift([0, 70, -20, 0], [0, 40, 70, 0], [1, 1.15, 0.95, 1], 22)}
      />
      <motion.div
        className="absolute -right-40 top-6 h-[30rem] w-[30rem] rounded-full bg-[#A855F7]/15 blur-[120px]"
        animate={drift([0, -50, 30, 0], [0, 60, -20, 0], [1, 1.2, 0.9, 1], 26)}
      />
      <motion.div
        className="absolute -bottom-56 left-1/3 h-[28rem] w-[28rem] rounded-full bg-[#22D3EE]/10 blur-[120px]"
        animate={drift([0, 40, -30, 0], [0, -40, 20, 0], [1, 1.1, 0.95, 1], 30)}
      />

      <div className="hero-bloom absolute inset-0" />
    </div>
  )
}

export default Aurora
