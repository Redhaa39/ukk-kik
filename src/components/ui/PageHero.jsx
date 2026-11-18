import { motion, useReducedMotion } from 'motion/react'
import { EASE, fadeUp, staggerContainer } from '../../lib/motion'
import Aurora from '../motion/Aurora'
import TextReveal from '../motion/TextReveal'

function PageHero({
  eyebrow,
  title,
  accent,
  description,
  actions,
  badge,
  children,
  className = '',
}) {
  const reduceMotion = useReducedMotion()

  return (
    <section
      className={`relative isolate overflow-hidden border-b border-[#27272A] bg-[#09090B] px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24 ${className}`}
    >
      <Aurora />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 bottom-0 hidden select-none text-[10rem] font-extrabold leading-none tracking-tighter text-white/[0.02] lg:block"
      >
        {eyebrow || 'PAGE'}
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full border border-dashed border-[#6366F1]/20 sm:h-80 sm:w-80"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[12%] top-[18%] h-24 w-24 rounded-full bg-[#6366F1]/20 blur-3xl"
      />

      <motion.div
        initial={reduceMotion ? undefined : 'hidden'}
        animate={reduceMotion ? undefined : 'visible'}
        variants={staggerContainer(0.09, 0.08)}
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        {actions && (
          <motion.div variants={fadeUp} className="mb-10">
            {actions}
          </motion.div>
        )}

        <div className="max-w-4xl">
          {badge && (
            <motion.div variants={fadeUp} className="mb-5">
              {badge}
            </motion.div>
          )}

          {eyebrow && (
            <div className="flex items-center gap-3">
              <motion.span
                aria-hidden="true"
                className="relative flex h-1.5 w-1.5 items-center justify-center"
                initial={reduceMotion ? undefined : { scale: 0, opacity: 0 }}
                animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE.expo, delay: 0.1 }}
              >
                <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-[#818CF8]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A5B4FC]" />
              </motion.span>
              <motion.p variants={fadeUp} className="label-caps text-[#A5B4FC]">
                {eyebrow}
              </motion.p>
              <motion.span
                aria-hidden="true"
                className="block h-px w-16 origin-left bg-gradient-to-r from-[#6366F1]/80 to-transparent"
                initial={reduceMotion ? undefined : { scaleX: 0 }}
                animate={reduceMotion ? undefined : { scaleX: 1 }}
                transition={{ duration: 0.9, ease: EASE.expo, delay: 0.3 }}
              />
            </div>
          )}

          <h1 className="mt-4 text-4xl font-extrabold leading-[0.98] tracking-[-0.02em] text-[#F5F5F5] sm:text-5xl lg:text-6xl">
            <TextReveal
              as="span"
              className="block"
              text={title}
              trigger="mount"
              delay={0.18}
              stagger={0.06}
            />
            {accent && (
              <TextReveal
                as="span"
                className="block font-editorial font-medium italic tracking-normal text-[#A5B4FC]"
                text={accent}
                trigger="mount"
                delay={0.34}
                wordClassName="accent-gradient"
                stagger={0.06}
              />
            )}
          </h1>

          <motion.span
            aria-hidden="true"
            className="mt-5 block h-px w-24 origin-left bg-gradient-to-r from-[#6366F1] via-[#A5B4FC] to-transparent"
            initial={reduceMotion ? undefined : { scaleX: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, ease: EASE.expo, delay: 0.75 }}
          />

          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8"
            >
              {description}
            </motion.p>
          )}

          {children}
        </div>
      </motion.div>
    </section>
  )
}

export default PageHero
