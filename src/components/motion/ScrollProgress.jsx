import { motion, useScroll, useSpring } from 'motion/react'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-[#6366F1] via-[#A5B4FC] to-[#22D3EE] shadow-[0_0_12px_rgba(99,102,241,0.75)]"
    />
  )
}

export default ScrollProgress
