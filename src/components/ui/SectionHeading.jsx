import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { EASE, fadeUpFor, staggerContainer, viewportRepeat } from '../../lib/motion'
import { useScrollDirection } from '../../hooks/useScrollDirection'

const alignments = {
  left: '',
  center: 'mx-auto text-center',
}

function SectionHeading({
  as: Title = 'h2',
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  className = '',
  children,
}) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const scrollDirection = useScrollDirection()
  const inView = useInView(ref, {
    once: false,
    amount: viewportRepeat.amount,
    margin: viewportRepeat.margin,
  })
  const MotionTitle = motion[Title] || motion.h2
  const active = reduceMotion || inView
  const centered = align === 'center'

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? undefined : 'hidden'}
      animate={reduceMotion ? undefined : inView ? 'visible' : 'hidden'}
      custom={scrollDirection}
      variants={staggerContainer(0.09, 0.04)}
      className={`max-w-3xl ${alignments[align] || ''} ${className}`}
    >
      {eyebrow && (
        <motion.div
          variants={fadeUpFor}
          className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
        >
          <motion.span
            aria-hidden="true"
            className="relative flex h-1.5 w-1.5 items-center justify-center"
            initial={reduceMotion ? undefined : { scale: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE.expo, delay: 0.05 }}
          >
            <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-[#818CF8]" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A5B4FC]" />
          </motion.span>
          <p className="label-caps text-[#A5B4FC]">{eyebrow}</p>
          <motion.span
            aria-hidden="true"
            className="block h-px w-14 origin-left bg-gradient-to-r from-[#6366F1]/80 to-transparent"
            initial={reduceMotion ? undefined : { scaleX: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE.expo, delay: 0.14 }}
          />
        </motion.div>
      )}

      <MotionTitle className="mt-4 text-3xl font-extrabold leading-[1.02] tracking-[-0.02em] text-[#F5F5F5] sm:text-4xl lg:text-[3.1rem]">
        <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="block will-change-transform"
            initial={reduceMotion ? undefined : { y: '112%', opacity: 0, rotate: 2 }}
            animate={
              reduceMotion
                ? undefined
                : active
                  ? { y: '0%', opacity: 1, rotate: 0 }
                  : { y: '112%', opacity: 0, rotate: 2 }
            }
            transition={{ duration: 0.9, ease: EASE.expo, delay: 0.08 }}
          >
            {title}
            {accent && (
              <span className="accent-gradient font-editorial font-medium italic tracking-normal">
                {' '}
                {accent}
              </span>
            )}
          </motion.span>
        </span>
      </MotionTitle>

      {description && (
        <motion.p
          variants={fadeUpFor}
          className={`mt-5 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8 ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {description}
        </motion.p>
      )}

      {children}
    </motion.div>
  )
}

export default SectionHeading
